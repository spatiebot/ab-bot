import { ITarget } from "./itarget";
import { GotoLocationInstruction } from "../instructions/goto-location";
import { IInstruction } from "../instructions/iinstruction";
import { GotoLocationConfig } from "../instructions/goto-location-config";
import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { Pos } from "../pos";
import { BaseTarget } from "./base-target";

export class GotoLocationTarget extends BaseTarget {
    private gotoLocationConfig: GotoLocationConfig;

    goal = "gotoLocation";
    private manualInfo: string;
    
    constructor(private env: IAirmashEnvironment, private readonly targetPos: Pos) {
        super();
        this.gotoLocationConfig = new GotoLocationConfig(env.myId());
    }

    onKill(killerID: number, killedID: number) {
    }

    getInstructions(): IInstruction[] {
        const result = [];

        this.gotoLocationConfig.desiredDistanceToTarget = 0;
        this.gotoLocationConfig.targetPos = this.targetPos;

        var instruction = new GotoLocationInstruction(this.env, null);
        instruction.configure(this.gotoLocationConfig);
        result.push(instruction);

        return result;
    }

    getInfo() {
        return {
            info: this.manualInfo || 'goto location ' + this.targetPos.x + ', ' + this.targetPos.y,
            id: null,
            pos: this.targetPos
        };
    }

    setInfo(info: string) {
        this.manualInfo = info;
    }

    isValid(): boolean {
        return true;
    }
}