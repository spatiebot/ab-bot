import { ITarget } from "./itarget";
import { IInstruction } from "../instructions/iinstruction";
import { DoNothingInstruction } from "../instructions/do-nothing-instruction";

export class DoNothingTarget implements ITarget {

    goal = "nothing";

    isValid(): boolean {
        return true;
    }

    getInstructions(): IInstruction[] {
        return [new DoNothingInstruction()]
    }
    
    onKill(killerID: number, killedID: number) {
    }
}