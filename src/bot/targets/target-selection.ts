import { ITarget } from "./itarget";
import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { DodgeMissileTarget } from "./dodge-missile-target";
import { BotCharacter } from "../bot-character";
import { CrateTarget } from "./crate-target";
import { OtherPlayerTarget } from "./other-player-target";
import { DoNothingTarget } from "./do-nothing.target";
import { DodgeEnemiesTarget } from "./dodge-enemies-target";
import { GotoLocationTarget } from "./goto-location-target";
import { Pos } from "../pos";
import { Calculations } from "../calculations";

const TIME_OUT = 60 * 1000; // 1 min

export class TargetSelection {
    private target: ITarget;
    private ctfTarget: ITarget;
    private lastLoggedTarget: string;
    private lastSelectedTime: number = 0;
    private lastTargetId: number;
    private dontSelectId: number;
    private timeout: number = 0;

    constructor(private env: IAirmashEnvironment, private character: BotCharacter) {
        this.env.on('playerkilled', (x) => this.onPlayerKilled(x));
    }

    reset() {
        this.target = null;
        this.lastSelectedTime = 0;
        this.lastLoggedTarget = "";

        // this was called on error, prevent selection of the same id the next time
        this.dontSelectId = this.lastTargetId;
        this.lastTargetId = null;
        this.timeout = Date.now() + 1000; // wait a sec before next target
    }

    private onPlayerKilled(data: any) {
        if (this.target) {
            this.target.onKill(data.killerID, data.killedID);
        }
    }

    getTarget(): ITarget {
        if (Date.now() < this.timeout) {
            return new DoNothingTarget();
        }

        let target = this.getPriorityTarget();
        if (!target) {
            if (this.env.getGameType() === 2) {
                target = this.getCtfTarget();
                this.ctfTarget = target;
            }
        }

        if (!target) {
            this.selectRegularTarget();
            target = this.target;
        }

        const targetInfo = target.getInfo();
        if (this.lastLoggedTarget !== targetInfo.info) {
            this.lastLoggedTarget = targetInfo.info
            console.log("Target: " + targetInfo.info);
        }

        if (targetInfo.id) {
            this.lastTargetId = targetInfo.id;
        }

        return target;
    }

    private getCtfTarget(): ITarget {
        const me = this.env.me();
        const myFlagInfo = this.env.getFlagInfo(me.team);
        const otherFlagInfo = this.env.getFlagInfo(me.team === 1 ? 2 : 1);

        if (!myFlagInfo.pos) {
            return;
        }
        if (!otherFlagInfo.pos) {
            return;
        }

        const flagDefaultX = me.team === 1 ? -9670 : 8600;
        const flagDefaultY = me.team === 1 ? -1470 : -940;

        if (otherFlagInfo.carrierId === me.id) {
            // i'm the flag carrier! Bring it home.
            return new GotoLocationTarget(this.env, new Pos({ x: flagDefaultX, y: flagDefaultY }));
        }

        let potentialNewTargets: ITarget[] = [];
        if (myFlagInfo.carrierId && myFlagInfo.carrierId !== this.dontSelectId) {
            // flag is taken, hunt the carrier
            if (this.ctfTarget && this.ctfTarget.getInfo().id === myFlagInfo.carrierId && this.ctfTarget.isValid()) {
                // already hunting
                return this.ctfTarget;
            }

            const killFlagCarrier = new OtherPlayerTarget(this.env, this.character, [], myFlagInfo.carrierId);

            if (killFlagCarrier.isValid()) {
                potentialNewTargets.push(killFlagCarrier);
            }
        }

        const flagIsHome = myFlagInfo.pos.x === flagDefaultX && myFlagInfo.pos.y === flagDefaultY;
        if (!flagIsHome) {
            // flag should be recovered
            const recoverFlag = new GotoLocationTarget(this.env, myFlagInfo.pos);
            potentialNewTargets.push(recoverFlag);
        }

        if (!otherFlagInfo.carrierId) {
            // go grab the enemy flag
            const grabFlag = new GotoLocationTarget(this.env, otherFlagInfo.pos);
            potentialNewTargets.push(grabFlag);
        }

        try {
            potentialNewTargets.sort((a, b) => {
                const distanceA = Calculations.getDelta(me.pos, a.getInfo().pos).distance;
                const distanceB = Calculations.getDelta(me.pos, b.getInfo().pos).distance;
                return distanceA - distanceB;
            });
        } catch (error) {
            // whatever
        }

        return potentialNewTargets[0];
    }

    private getPriorityTarget(): ITarget {
        // dodging bullets is always a priority
        const dodge = new DodgeMissileTarget(this.env, this.character, [this.dontSelectId]);
        if (dodge.isValid()) {
            return dodge;
        }

        const avoid = new DodgeEnemiesTarget(this.env, this.character, [this.dontSelectId]);
        if (avoid.isValid()) {
            return avoid;
        }

        return null;
    }

    private selectRegularTarget(): void {

        const hasTarget = !!this.target;
        const isFulfillingPrimaryGoal = hasTarget && this.target.goal === this.character.goal;
        const isTargetTimedOut = Date.now() - this.lastSelectedTime > TIME_OUT;
        const isTargetValid = hasTarget && !isTargetTimedOut && this.target.isValid();
        const isLastResortTarget = isTargetValid && this.target.goal === "nothing" && this.character.goal !== "nothing";

        if (isTargetValid && isFulfillingPrimaryGoal) {
            // no need to select another target
            return;
        }

        if (isTargetTimedOut) {
            console.log("Target timed out. Select a new one");
        }

        let potentialNewTarget: ITarget;
        if (this.character.goal === 'stealCrates') {
            potentialNewTarget = new CrateTarget(this.env, [this.dontSelectId]);
        } else if (this.character.goal === 'fight') {
            potentialNewTarget = new OtherPlayerTarget(this.env, this.character, [this.dontSelectId]);
        } else if (this.character.goal === "nothing") {
            potentialNewTarget = new DoNothingTarget();
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
        this.target = new OtherPlayerTarget(this.env, this.character, [this.dontSelectId]);
        this.lastSelectedTime = Date.now();

        if (!this.target.isValid()) {
            // even the default target failed. We're out of ideas.
            this.target = new DoNothingTarget();
            this.lastSelectedTime = Date.now();
        }
    }
}