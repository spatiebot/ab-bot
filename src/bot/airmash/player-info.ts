import { Pos } from "../pos";

export class PlayerInfo {

    pos: Pos;
    lowResPos: Pos;
    speed: Pos;
    id: number;
    team: number;
    name: string;
    // maxRotationSpeed: number;
    rot: number;
    type: number;
    isHidden: boolean;
    isStealthed: boolean;
    energy: number;
    health: number;
    isInView: boolean;
    hasInferno: boolean;
    hasShield: boolean;

    static getMostReliablePos(p: PlayerInfo) {
        if (p.isInView) {
            return p.pos;
        } else {
            return p.lowResPos;
        }
    } 
}