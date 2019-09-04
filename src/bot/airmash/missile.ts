import { Pos } from "../pos";

export class Missile {
    id: number;
    playerID: number;
    pos: Pos;
    rot: number;
    speed: Pos;
    type: number;
}