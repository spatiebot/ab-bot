
import { IInstruction } from "../instructions/iinstruction";
import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { PlayerInfo } from "../airmash/player-info";
import { GotoLocationConfig } from "../instructions/goto-location-config";
import { GotoLocationInstruction } from "../instructions/goto-location";
import { Calculations } from "../calculations";
import { BaseTarget } from "./base-target";
import { StopWatch } from "../../helper/timer";
import { Pos } from "../pos";
import { Logger } from "../../helper/logger";

const TIME_OUT_SECS = 10;
const POOP_DISTANCE = 150;
const TOO_FAR_AWAY_FOR_POOPING_FLAG = 1500;

class HandOverFlagTarget extends BaseTarget {

    goal = 'handoverflag';

    private targetID: number;
    private gotoLocationConfig: GotoLocationConfig;
    private shouldRecycle: boolean;
    private timer = new StopWatch();

    constructor(private env: IAirmashEnvironment, private logger: Logger, playerID: number) {
        super();

        this.gotoLocationConfig = new GotoLocationConfig(this.env.myId());
        this.targetID = playerID;
        this.timer.start();
    }

    isValid(): boolean {

        if (this.shouldRecycle) {
            return false;
        }

        if (this.timer.elapsedSeconds() > TIME_OUT_SECS) {
            return false;
        }

        if (!this.getTarget()) {
            return false;
        }

        return true;
    }

    private getTarget(): PlayerInfo {
        const p = this.env.getPlayer(this.targetID);
        if (!p) {
            return null;
        }
        if (p.isStealthed || p.isHidden) {
            return null;
        }
        return p;
    }

    getInfo(): { info: string; id: number; pos: Pos } {
        return {
            info: "hand over flag to " + this.targetID,
            id: this.targetID,
            pos: null
        };
    }

    getInstructions(): IInstruction[] {
        const result = [];

        if (!this.isValid()) {
            return result;
        }

        const target = this.getTarget();
        const targetPos = PlayerInfo.getMostReliablePos(target);

        const delta = Calculations.getDelta(this.env.me().pos, targetPos);
        if (targetPos.isAccurate && delta.distance < POOP_DISTANCE) {
            // within poopable distance
            this.env.sendSay("Good luck!");
            this.env.sendCommand("drop", "");

            this.logger.info("pooped the flag");

            this.shouldRecycle = true;
        } else if (delta.distance > TOO_FAR_AWAY_FOR_POOPING_FLAG) {
            this.shouldRecycle = true;
        } else {
            this.gotoLocationConfig.desiredDistanceToTarget = 0;
            this.gotoLocationConfig.targetPos = targetPos;

            const instruction = new GotoLocationInstruction(this.env, this.logger, null, this.targetID);
            instruction.configure(this.gotoLocationConfig);
            result.push(instruction);
        }
        return result;
    }

    onKill(killerID: number, killedID: number) {
        if (killedID === this.targetID) {
            this.shouldRecycle = true;
        }
        if (killedID === this.env.myId()) {
            this.shouldRecycle = true;
        }
    }
}

export { HandOverFlagTarget, TOO_FAR_AWAY_FOR_POOPING_FLAG }

