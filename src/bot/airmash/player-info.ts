import { Pos } from "../pos";
import { Upgrades } from "../../api/upgrades";

export class PlayerInfo {

    pos: Pos;
    lowResPos: Pos;
    speed: Pos;
    id: number;
    team: number;
    name: string;
    rot: number;
    type: number;
    isDead: boolean;
    isHidden: boolean;
    isStealthed: boolean;
    energy: number;
    health: number;
    isInView: boolean;
    hasInferno: boolean;
    hasShield: boolean;
    upgrades: Upgrades;

    static getMostReliablePos(p: PlayerInfo) {
        if (p.isInView) {
            return p.pos;
        } else {
            return p.lowResPos;
        }
    } 
}