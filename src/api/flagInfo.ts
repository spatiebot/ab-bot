import { Pos } from "../bot/pos";

export class FlagInfo {
    constructor(readonly flag: number) {
    }

    pos: Pos;
    carrierId: number;
}