import { ITarget } from "./itarget";
import { IInstruction } from "../instructions/iinstruction";
import { Pos } from "../pos";

export abstract class BaseTarget implements ITarget {
    abstract isValid(): boolean;
    abstract getInstructions(): IInstruction[];
    abstract onKill(killerID: number, killedID: number);
    abstract getInfo(): { info: string, id: number, pos: Pos };
    abstract goal: string;

    isActive: boolean;

    equals(other: ITarget): boolean {
        if (!other) {
            return false;
        }   
        const otherInfo = other.getInfo();
        const myInfo = this.getInfo();

        return otherInfo.info === myInfo.info;
    }
}