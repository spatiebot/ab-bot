import { IInstruction } from "../instructions/iinstruction";
import { Pos } from "../pos";

export interface ITarget {
    isValid(): boolean;
    getInstructions(): IInstruction[];
    onKill(killerID: number, killedID: number);
    getInfo(): { info: string, id: number, pos: Pos };
    goal: string;
    isActive: boolean;
    equals(other: ITarget): boolean;
}