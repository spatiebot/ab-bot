import { GotoLocationInstruction } from "../instructions/goto-location";
import { IInstruction } from "../instructions/iinstruction";
import { GotoLocationConfig } from "../instructions/goto-location-config";
import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { Pos } from "../pos";
import { BaseTarget } from "./base-target";
import { FireInstruction } from "../instructions/fire-instruction";
import { FlagHelpers } from "../../helper/flaghelpers";
import { Logger } from "../../helper/logger";

export class BringFlagHomeTarget extends BaseTarget {
    private gotoLocationConfig: GotoLocationConfig;

    goal = "gotoLocation";
    
    constructor(private env: IAirmashEnvironment, private logger: Logger, private readonly targetPos: Pos, private readonly isInDangerZone) {
        super();
        this.gotoLocationConfig = new GotoLocationConfig(env.myId());
    }

    onKill(killerID: number, killedID: number) {
    }

    getInstructions(): IInstruction[] {
        const result = [];

        this.gotoLocationConfig.desiredDistanceToTarget = 0;
        this.gotoLocationConfig.targetPos = this.targetPos;
        this.gotoLocationConfig.flyBackwards = !this.isInDangerZone;

        const instruction = new GotoLocationInstruction(this.env, this.logger, null);
        instruction.configure(this.gotoLocationConfig);
        result.push(instruction);
        result.push(new FireInstruction());

        return result;
    }

    getInfo() {
        return {
            info: 'bring flag home' + (this.isInDangerZone ? ' from dangerzone' : '') + ': ' + this.targetPos.x + ', ' + this.targetPos.y,
            id: null,
            pos: this.targetPos
        };
    }

    isValid(): boolean {
        return FlagHelpers.isCarryingFlag(this.env);
    }
}