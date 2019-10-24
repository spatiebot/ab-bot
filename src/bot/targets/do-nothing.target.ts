import { ITarget } from "./itarget";
import { IInstruction } from "../instructions/iinstruction";
import { DoNothingInstruction } from "../instructions/do-nothing-instruction";
import { BaseTarget } from "./base-target";

export class DoNothingTarget extends BaseTarget {

    goal = "nothing";

    isValid(): boolean {
        return true;
    }


    getInfo() {
        return {
            info: 'Nothing',
            id: null,
            pos: null
        };
    }
    getInstructions(): IInstruction[] {
        return [new DoNothingInstruction()]
    }

    onKill(killerID: number, killedID: number) {
    }
}