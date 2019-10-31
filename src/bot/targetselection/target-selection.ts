import { ITarget } from "../targets/itarget";
import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { DodgeMissileTarget } from "../targets/dodge-missile-target";
import { BotCharacter } from "../bot-character";
import { CrateTarget } from "../targets/crate-target";
import { OtherPlayerTarget } from "../targets/other-player-target";
import { DoNothingTarget } from "../targets/do-nothing.target";
import { DodgeEnemiesTarget } from "../targets/dodge-enemies-target";
import { Pos } from "../pos";
import { ProtectTarget } from "../targets/protect-target";
import { ITargetSelection } from "./itarget-selection";
import { Logger } from "../../helper/logger";

const TIME_OUT = 60 * 1000; // 1 min
const PROTECT_TIME_OUT = 5 * TIME_OUT;

export class TargetSelection implements ITargetSelection {
    private target: ITarget;
    private tempTarget: ITarget;
    private lastLoggedTarget: string;
    private lastSelectedTime = 0;
    private lastTargetId: number;
    private dontSelectId: number;
    private timeout = 0;
    private protectId = 0;

    private chatSubscription: number;
    private playerKilledSubscription: number;

    constructor(private env: IAirmashEnvironment, private logger: Logger, private character: BotCharacter) {
        this.chatSubscription = this.env.on('chat', msg => this.onChat(msg));
        this.playerKilledSubscription = this.env.on('playerkilled', (x) => this.onPlayerKilled(x));
    }

    dispose(): void {
        this.env.off('chat', this.chatSubscription);
        this.env.off('playerkilled', this.playerKilledSubscription);
    }

    reset(): void {
        this.target = null;
        this.lastSelectedTime = 0;
        this.lastLoggedTarget = "";

        // this was called on error, prevent selection of the same id the next time
        this.dontSelectId = this.lastTargetId;
        this.lastTargetId = null;
        this.protectId = null;
        this.timeout = Date.now() + 500; // wait a sec before next target
        this.tempTarget = new DoNothingTarget();
    }

    private onPlayerKilled(data: any) {
        if (this.target) {
            this.target.onKill(data.killerID, data.killedID);
        }
    }

    private onChat(msg) {
        if (msg.id === this.env.myId()) {
            return;
        }
        if (msg.text.indexOf('#drop') !== -1) {
            const player = this.env.getPlayer(msg.id);
            if (player.team === this.env.me().team) {
                this.env.sendCommand("drop", "");
                this.tempTarget = new ProtectTarget(this.env, this.logger, this.character, msg.id, 300);
                this.timeout = Date.now() + 10000; // wait a few sec before next target
            }
        }
        if (this.character.goal === 'protect') {
            if (msg.text.indexOf('#protect me') !== -1) {
                this.logger.debug('Protect me instruction received');
                if (!this.protectId) {
                    this.protectId = msg.id;
                    this.logger.debug('ProtectID: ' + this.protectId);
                    const player = this.env.getPlayer(this.protectId);
                    if (player) {
                        this.env.sendChat("OK, " + player.name + ", I'm heading your way. Say '#unprotect' to stop me from following you.", false)
                    } else {
                        this.logger.debug('ProtectID apparently invalid');
                        this.protectId = null;
                    }
                } else {
                    this.logger.debug("ignoring: already on another target");
                }
            } else if (msg.text.indexOf('#unprotect') !== -1) {
                this.logger.debug('Unprotect message');
                if (this.protectId === msg.id) {
                    this.logger.debug('From protectplayer');
                    const player = this.env.getPlayer(this.protectId);
                    this.env.sendChat("I'll stop following you, " + player.name, false);
                    this.protectId = null;
                    this.target = null;
                }
            }
        }
    }

    exec(): ITarget {
        if (Date.now() < this.timeout && this.tempTarget.isValid()) {
            return this.tempTarget;
        }

        let target = this.getPriorityTarget();

        if (!target) {
            this.selectRegularTarget();
            target = this.target;
        }

        const targetInfo = target.getInfo();
        if (this.lastLoggedTarget !== targetInfo.info) {
            this.lastLoggedTarget = targetInfo.info
            this.logger.info("Target: " + targetInfo.info);
        }

        if (targetInfo.id) {
            this.lastTargetId = targetInfo.id;
        }

        return target;
    }

    private getPriorityTarget(): ITarget {
        // dodging bullets is always a priority
        const dodge = new DodgeMissileTarget(this.env, this.character, [this.dontSelectId]);
        if (dodge.isValid()) {
            return dodge;
        }

        const dontSelect = [this.dontSelectId];
        if (this.protectId) {
            dontSelect.push(this.protectId);
        }
        const avoid = new DodgeEnemiesTarget(this.env, this.logger, this.character, dontSelect);
        if (avoid.isValid()) {
            return avoid;
        }

        return null;
    }

    private selectRegularTarget(): void {

        const hasTarget = !!this.target;
        const isFulfillingPrimaryGoal = hasTarget && this.target.goal === this.character.goal;
        const timeOut = hasTarget && this.target.goal === 'protect' ? PROTECT_TIME_OUT : TIME_OUT;
        const isTargetTimedOut = Date.now() - this.lastSelectedTime > timeOut;
        const isTargetValid = hasTarget && !isTargetTimedOut && this.target.isValid();
        const isLastResortTarget = isTargetValid && this.target.goal === "nothing" && this.character.goal !== "nothing";

        if (isTargetValid && isFulfillingPrimaryGoal) {
            // no need to select another target
            return;
        }

        if (isTargetTimedOut) {
            this.logger.warn("Target timed out. Select a new one");

            this.protectId = null;
        }

        let potentialNewTarget: ITarget;
        if (this.character.goal === 'stealCrates') {
            potentialNewTarget = new CrateTarget(this.env, this.logger, [this.dontSelectId]);
        } else if (this.character.goal === 'fight') {
            potentialNewTarget = new OtherPlayerTarget(this.env, this.logger, this.character, [this.dontSelectId]);
        } else if (this.character.goal === "nothing") {
            potentialNewTarget = new DoNothingTarget();
        } else if (this.character.goal === "protect") {
            potentialNewTarget = new ProtectTarget(this.env, this.logger, this.character, this.protectId, 300);
        } else if (this.character.goal === "brexit") {
            potentialNewTarget = new ProtectTarget(this.env, this.logger, this.character, new Pos({
                x: -403.046875, y: -3182.646484375 // UK
            }), 400);
            potentialNewTarget.goal = "brexit";
        } else if (this.character.goal === "greenland") {
            potentialNewTarget = new ProtectTarget(this.env, this.logger, this.character, new Pos({
                x: -5246.271484375, y: -7008.716796875 // Greenland
            }), 400);
            potentialNewTarget.goal = "greenland";
        }

        if (potentialNewTarget && potentialNewTarget.isValid()) {
            this.target = potentialNewTarget;
            this.lastSelectedTime = Date.now();
            return;
        }

        // now we have a failed attempt at selecting a new target, while it's still necessary to select one.
        // maybe on second thought it's not that important. At least we need a valid target, even if it
        // does not fulfill the primary goal
        if (isTargetValid && !isLastResortTarget) {
            return;
        }

        // so take the default target then
        this.target = new OtherPlayerTarget(this.env, this.logger, this.character, [this.dontSelectId]);
        this.lastSelectedTime = Date.now();

        if (!this.target.isValid()) {
            // even the default target failed. We're out of ideas.
            this.target = new DoNothingTarget();
            this.lastSelectedTime = Date.now();
        }
    }
}