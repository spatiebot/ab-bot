import { ITargetSelection } from "./itarget-selection";
import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { BotCharacter } from "../bot-character";
import { ITarget } from "../targets/itarget";
import { FlagInfo } from "../../api/flagInfo";
import logger = require("../../helper/logger");
import { Calculations } from "../calculations";
import { Pos } from "../pos";
import { DoNothingTarget } from "../targets/do-nothing.target";
import { DodgeMissileTarget } from "../targets/dodge-missile-target";
import { GotoLocationTarget } from "../targets/goto-location-target";
import { OtherPlayerTarget } from "../targets/other-player-target";
import { ProtectTarget } from "../targets/protect-target";
import { StopWatch } from "../../helper/timer";
import { CrateTarget } from "../targets/crate-target";
import { BringFlagHomeTarget } from "../targets/bring-flag-home-target";
import { PlayerInfo } from "../airmash/player-info";

enum FlagStates {
    Unknown = "Unkown",
    ImCarrier = "I'm the flag carrier",
    ImCarrierInDangerZone = "I just grabbed the flag, still in enemy base",
    MyFlagTaken = "My flag is taken",
    MyFlagDisplaced = "My flag is displaced",
    OtherFlagTaken = "The other flag is taken",
    AllIsPeaceful = "Calm before the storm"
}

const blueFlagPositions = {
    defaultPos: new Pos({ x: -9670, y: -1470 }),
    safeLines: { x: -7813, y: -505 }
};

const redFlagPositions = {
    defaultPos: new Pos({ x: 8600, y: -940 }),
    safeLines: { x: 6902, y: 6 }
};

const REEVALUATION_TIME_MS = 1500;
const CRATE_DISTANCE_THRESHOLD = 500;
const FIGHT_DISTANCE_THRESHOLD = 300;
const PROTECT_ZONE = 700;

export class CtfTargetSelection implements ITargetSelection {

    // cached state
    private myId: number;
    private myFlagInfo: FlagInfo;
    private otherFlagInfo: FlagInfo;
    private myTeam: number;
    private otherTeam: number;
    private flagState: FlagStates;
    private defaultMyFlagPos: Pos;
    private defaultOtherFlagPos: Pos;

    // real state
    private myRole: string;
    private targets: ITarget[] = [];
    private lastLog: string;
    private stopwatch = new StopWatch();
    private distanceToMyFlag: number;
    private distanceToOtherFlag: number;

    private chatSubscription: number;
    private playerKilledSubscription: number;

    constructor(private env: IAirmashEnvironment, private character: BotCharacter) {
        this.reset();
        this.chatSubscription = this.env.on('chat', msg => this.onChat(msg));
        this.playerKilledSubscription = this.env.on('playerkilled', (x) => this.onPlayerKilled(x));
    }

    reset(): void {
        this.myRole = null;
        this.targets = [];
        this.lastLog = null;
        this.stopwatch.start();
    }

    dispose(): void {
        this.env.off('chat', this.chatSubscription);
        this.env.off('playerkilled', this.playerKilledSubscription);
    }

    exec(): ITarget {

        this.updateFlagInfo();
        const flagstate = this.determineFlagState();

        if (flagstate !== this.flagState) {
            logger.warn("Most urgent flagstate: " + flagstate);
            this.flagState = flagstate;
        }

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

        if (this.flagState !== FlagStates.ImCarrierInDangerZone) {
            // take crates nearby
            const crate = new CrateTarget(this.env, []);
            crate.setMaxDistance(CRATE_DISTANCE_THRESHOLD);
            if (crate.isValid()) {
                this.targets.push(crate);
                return;
            }

            // attack enemies nearby
            if (this.myRole === "A") {
                const fight = new OtherPlayerTarget(this.env, this.character, []);
                fight.setMaxDistance(FIGHT_DISTANCE_THRESHOLD);
                if (fight.isValid()) {
                    this.targets.push(fight);
                    return;
                }
            }
        }

        const currentTargetIsOK = this.peek() && this.peek().isValid();
        const shouldReevaluateTarget = this.stopwatch.elapsedMs() > REEVALUATION_TIME_MS || !currentTargetIsOK;


        if (!shouldReevaluateTarget) {
            return;
        }

        if (this.peek() && this.peek().isSticky) {
            // sticky target on top, don't reevaluate
            return;
        }

        var target = this.determineTarget();
        if (currentTargetIsOK) {
            // only replace it if it is a different target
            if (!target.equals(this.peek())) {
                this.targets.push(target);
            }
        } else {
            this.targets.push(target);
        }

        this.stopwatch.start();
    }

    private logState(): void {

        const info = this.peek().getInfo();
        if (info.info !== this.lastLog) {
            logger.warn("CTF target: " + info.info);
            this.lastLog = info.info;
        }
    }

    private determineTarget(): ITarget {

        if (this.flagState === FlagStates.Unknown) {
            return new DoNothingTarget();
        }

        const doDefensiveActions = this.myRole === "D" || this.distanceToMyFlag < this.distanceToOtherFlag;

        if (this.flagState === FlagStates.ImCarrier || this.flagState === FlagStates.ImCarrierInDangerZone) {
            var goHome = new BringFlagHomeTarget(this.env, this.defaultMyFlagPos, this.flagState === FlagStates.ImCarrierInDangerZone);
            return goHome;
        }

        if (this.flagState === FlagStates.MyFlagTaken && doDefensiveActions) {
            const killFlagCarrier = new OtherPlayerTarget(this.env, this.character, [], this.myFlagInfo.carrierId);
            killFlagCarrier.setInfo("Hunt flag carrier");
            return killFlagCarrier;
        }

        if (this.flagState === FlagStates.MyFlagDisplaced && doDefensiveActions) {
            const recoverFlag = new GotoLocationTarget(this.env, this.myFlagInfo.pos);
            recoverFlag.setInfo("recover abandoned flag");
            return recoverFlag;
        }

        if (this.myRole === "A") {
            if (this.flagState === FlagStates.OtherFlagTaken) {
                const protectCarrier = new ProtectTarget(this.env, this.character, Number(this.otherFlagInfo.carrierId), 300);
                protectCarrier.setInfo("protect flag carrier");
                return protectCarrier;
            }

            const grabFlag = new GotoLocationTarget(this.env, this.otherFlagInfo.pos);
            grabFlag.setInfo("Go grab flag");
            return grabFlag;
        } else {
            const protectFlag = new ProtectTarget(this.env, this.character, this.myFlagInfo.pos, PROTECT_ZONE);
            protectFlag.setInfo("protect my flag");
            return protectFlag;
        }
    }

    private updateFlagInfo() {
        const me = this.env.me();

        this.myId = me.id;

        if (this.myTeam !== me.team) {
            logger.warn(`I am on the ${me.team === 1 ? "blue" : "red"} team`);
            this.myTeam = me.team;
            this.otherTeam = me.team === 1 ? 2 : 1;
        }

        this.myFlagInfo = this.env.getFlagInfo(this.myTeam);
        this.otherFlagInfo = this.env.getFlagInfo(this.otherTeam);

        this.defaultMyFlagPos = this.myTeam === 1 ? blueFlagPositions.defaultPos : redFlagPositions.defaultPos;
        this.defaultOtherFlagPos = this.myTeam === 1 ? redFlagPositions.defaultPos : blueFlagPositions.defaultPos;

        if (this.myFlagInfo.pos) {
            this.distanceToMyFlag = Calculations.getDelta(this.myFlagInfo.pos, me.pos).distance;
            this.distanceToOtherFlag = Calculations.getDelta(this.otherFlagInfo.pos, me.pos).distance;
        }

        if (!this.myRole) {
            const dieCast = Calculations.getRandomInt(1, 3);
            this.myRole = "D"; // dieCast === 1 ? "A" : "D";
            logger.warn("My role is " + this.myRole);
        }
    }

    private determineFlagState(): FlagStates {

        if (!this.myFlagInfo.pos || !this.otherFlagInfo.pos) {
            // no need to evaluate further
            return FlagStates.Unknown;
        }

        if (this.otherFlagInfo.carrierId === this.myId) {
            const myPos = this.env.me().pos;
            if (this.myTeam === 1) {
                if (myPos.y < redFlagPositions.safeLines.y && myPos.x > redFlagPositions.safeLines.x) {
                    return FlagStates.ImCarrierInDangerZone;
                }
            }
            if (this.myTeam === 2) {
                if (myPos.y < blueFlagPositions.safeLines.y && myPos.x < blueFlagPositions.safeLines.x) {
                    return FlagStates.ImCarrierInDangerZone;
                }
            }

            return FlagStates.ImCarrier;
        }

        const currentFlagStates: { state: FlagStates, distanceToEvent: number }[] = [];

        // my flag taken?
        if (this.myFlagInfo.carrierId) {
            const carrier = this.env.getPlayer(this.myFlagInfo.carrierId);
            if (carrier) {
                const deltaToCarrier = Calculations.getDelta(carrier.pos, this.env.me().pos);
                if (deltaToCarrier) {
                    currentFlagStates.push({
                        state: FlagStates.MyFlagTaken,
                        distanceToEvent: deltaToCarrier.distance
                    });
                }
            }
            // my flag displaced?
        } else if (Calculations.getDelta(this.defaultMyFlagPos, this.myFlagInfo.pos).distance > 100) {
            const deltaToFlag = Calculations.getDelta(this.myFlagInfo.pos, this.env.me().pos);
            if (deltaToFlag) {
                currentFlagStates.push({
                    state: FlagStates.MyFlagDisplaced,
                    distanceToEvent: deltaToFlag.distance
                });
            }
        }

        // other flag taken?
        if (this.otherFlagInfo.carrierId) {
            const carrier = this.env.getPlayer(this.otherFlagInfo.carrierId);
            if (carrier) {
                const deltaToCarrier = Calculations.getDelta(carrier.pos, this.env.me().pos);
                if (deltaToCarrier) {
                    currentFlagStates.push({
                        state: FlagStates.OtherFlagTaken,
                        distanceToEvent: deltaToCarrier.distance
                    });
                }
            }
        }

        if (currentFlagStates.length === 0) {
            return FlagStates.AllIsPeaceful;
        }

        currentFlagStates.sort((a, b) => a.distanceToEvent - b.distanceToEvent);
        return currentFlagStates[0].state;
    }


    private onPlayerKilled(data: any) {
        for (let t of this.targets) {
            t.onKill(data.killerID, data.killedID);
        }
    }

    private onChat(msg) {
        if (msg.id === this.myId) {
            return;
        }
        const player = this.env.getPlayer(msg.id);
        const me = this.env.me();

        if (msg.text.indexOf('#drop') !== -1) {
            if (player.team === me.team) {
                const distance = Calculations.getDelta(me.pos, player.pos).distance;
                if (distance < 300) {
                    this.env.sendCommand("drop", "");
                } else {
                    this.env.sendTeam("too far away!");
                }
            }
        }

        const assistMatch = /^\s*#assist\s+(.+)$/.exec(msg.text);
        if (assistMatch) {
            if (this.myRole === "A" && player.team === this.myTeam) {
                const playerName = assistMatch[1];
                let playerToAssist: PlayerInfo;
                if (playerName === 'me') {
                    playerToAssist = player;
                } else {
                    playerToAssist = this.env.getPlayers().find(x => x.name.toLowerCase() === playerName.toLowerCase())
                }

                if (playerToAssist && playerToAssist.team === this.myTeam) {
                    const target = new ProtectTarget(this.env, this.character, playerToAssist.id, 200);
                    target.isSticky = true;
                    this.targets.push(target);
                }
            }
        }
    }

}