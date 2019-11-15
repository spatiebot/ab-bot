import { ITarget } from "../targets/itarget";
import { ITargetSelection } from "./itarget-selection";
import { StopWatch } from "../../helper/timer";
import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { BotCharacter } from "../bot-character";
import { BotContext } from "../../botContext";
import { Logger } from "../../helper/logger";
import { DodgeMissileTarget } from "../targets/dodge-missile-target";
import { CrateTarget } from "../targets/crate-target";
import { OtherPlayerTarget } from "../targets/other-player-target";
import { DoNothingTarget } from "../targets/do-nothing.target";
import { ProtectTarget } from "../targets/protect-target";
import { Pos } from "../pos";

const REEVALUATION_TIME_MS = 1500;
const TARGET_TIMOUT_MINUTES = 1;

export class FfaTargetSelection implements ITargetSelection {

    // cached state
    private myId: number;

    // real state
    private targets: ITarget[] = [];
    private lastLog: string;
    private reevaluationTimer = new StopWatch();
    private playerKilledSubscription: number;
    private chatSubscription: number;
    private protectID: number;

    private targetTimeoutTimer = new StopWatch();

    private get env(): IAirmashEnvironment {
        return this.context.env;
    }

    private get logger(): Logger {
        return this.context.logger;
    }

    private get character(): BotCharacter {
        return this.context.character;
    }

    constructor(private context: BotContext) {
        this.reset();
        this.playerKilledSubscription = this.env.on('playerkilled', (x) => this.onPlayerKilled(x));
        this.chatSubscription = this.env.on('chat', msg => this.onChat(msg));
    }

    reset(): void {
        this.clearAllTargets();
        this.lastLog = null;
        this.reevaluationTimer.start();
        this.targetTimeoutTimer.start();
        this.protectID = null;
    }

    dispose(): void {
        this.env.off('playerkilled', this.playerKilledSubscription);
        this.env.off('chat', this.chatSubscription);
    }

    exec(): ITarget {

        this.updateTargetStack();

        this.logState();

        this.targets.forEach(element => {
            element.isActive = false;
        });

        const activeTarget = this.peek();
        activeTarget.isActive = true;

        return activeTarget;
    }

    private peek(): ITarget {
        return this.targets[this.targets.length - 1];
    }

    private removeStaleTargetsFromStack() {

        const invalidTargets: ITarget[] = [];
        for (let i = 0; i < this.targets.length; i++) {
            const t = this.targets[i];
            if (!t.isValid()) {
                invalidTargets.push(t);
            }
        }
        this.targets = this.targets.filter(x => invalidTargets.indexOf(x) === -1);

    }

    private updateTargetStack(): void {
        // dodging always goes first
        const dodge = new DodgeMissileTarget(this.env, this.character, []);
        if (dodge.isValid()) {
            this.targets.push(dodge);
            return;
        }

        this.removeStaleTargetsFromStack();

        const isTargetTimedOut = this.targetTimeoutTimer.elapsedMinutes() > TARGET_TIMOUT_MINUTES;
        if (isTargetTimedOut) {
            this.clearAllTargets();
        }

        let currentTargetIsOK = this.peek() && this.peek().isValid();
        const shouldReevaluateTarget = this.reevaluationTimer.elapsedMs() > REEVALUATION_TIME_MS || !currentTargetIsOK;

        if (!shouldReevaluateTarget) {
            return;
        }

        if (currentTargetIsOK && this.peek().isSticky) {
            // sticky target on top, don't reevaluate
            return;
        }

        const target = this.determineTarget();
        if (currentTargetIsOK) {
            // only replace it if it is a different target
            if (!target.equals(this.peek())) {
                this.targetTimeoutTimer.start();
                this.targets.push(target);
            }
        } else {
            this.targetTimeoutTimer.start();
            this.targets.push(target);
        }

        this.reevaluationTimer.start();
    }

    private logState(): void {

        const info = this.peek().getInfo();
        if (info.info !== this.lastLog) {
            this.logger.info("FFA target: " + info.info);
            this.lastLog = info.info;
        }
    }

    private onPlayerKilled(data: any) {
        for (const t of this.targets) {
            t.onKill(data.killerID, data.killedID);
        }
    }

    private clearAllTargets() {
        this.targets = [];
    }

    private determineTarget(): ITarget {

        const crateTarget = new CrateTarget(this.env, this.logger, []);
        if (crateTarget.isValid()) {
            return crateTarget;
        }

        if (this.character.goal === 'fight') {
            const otherPlayerTarget = new OtherPlayerTarget(this.env, this.logger, this.character, []);
            if (otherPlayerTarget.isValid()) {
                otherPlayerTarget.isSticky = true;
                return otherPlayerTarget;
            }
        }

        if (this.character.goal === "nothing") {
            return new DoNothingTarget();
        }

        if (this.character.goal === "protect") {
            const protectTarget = new ProtectTarget(this.env, this.logger, this.character, this.protectID, 300);
            protectTarget.isActive = true;
            if (protectTarget.isValid()) {
                protectTarget.isSticky = true;
                return protectTarget;
            }
        }

        if (this.character.goal === "brexit") {
            const brexitTarget = new ProtectTarget(this.env, this.logger, this.character, new Pos({
                x: -403.046875, y: -3182.646484375 // UK
            }), 400);
            brexitTarget.goal = "brexit";
            brexitTarget.isSticky = true;
            return brexitTarget;
        }

        if (this.character.goal === "greenland") {
            const greenland = new ProtectTarget(this.env, this.logger, this.character, new Pos({
                x: -5246.271484375, y: -7008.716796875 // Greenland
            }), 400);
            greenland.goal = "greenland";
            greenland.isSticky = true;
            return greenland;
        }

        
        if (this.character.goal === "australia") {
            const australia = new ProtectTarget(this.env, this.logger, this.character, new Pos({
                x: 11898, y: 4522 // Australia
            }), 400);
            australia.goal = "australia";
            australia.isSticky = true;
            return australia;
        }

        // there is still no target selected,
        // so take the default target then
        const defaultTarget = new OtherPlayerTarget(this.env, this.logger, this.character, []);

        if (!defaultTarget.isValid()) {
            return defaultTarget;
        }

        // even the default target failed. We're out of ideas.
        return new DoNothingTarget();
    }

    private onChat(msg) {
        if (msg.id === this.env.myId()) {
            return;
        }

        if (this.character.goal === 'protect') {
            if (msg.text.indexOf('#protect me') !== -1) {
                this.logger.debug('Protect me instruction received');
                if (!this.protectID) {
                    this.protectID = msg.id;
                    this.logger.info('ProtectID: ' + this.protectID);
                    const player = this.env.getPlayer(this.protectID);
                    if (player) {
                        // this.env.sendChat("OK, " + player.name + ", I'm heading your way. Say '#unprotect' to stop me from following you.", false)
                    } else {
                        this.logger.info('ProtectID apparently invalid');
                        this.protectID = null;
                    }
                } else {
                    this.logger.info("ignoring: already on another target");
                }
            } else if (msg.text.indexOf('#unprotect') !== -1) {
                this.logger.debug('Unprotect message');
                if (this.protectID === msg.id) {
                    this.logger.debug('From protectplayer');
                    const player = this.env.getPlayer(this.protectID);
                    // this.env.sendChat("I'll stop following you, " + player.name, false);
                    this.protectID = null;
                    this.clearAllTargets();
                }
            }
        }
    }
}