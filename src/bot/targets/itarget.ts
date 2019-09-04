import { IInstruction } from "../instructions/iinstruction";

export interface ITarget {
    isValid(): boolean;
    getInstructions(): IInstruction[];
    onKill(killerID: number, killedID: number)
    goal: string;
}