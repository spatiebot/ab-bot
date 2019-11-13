import { Pos } from "../pos";
import { Upgrades } from "../../api/upgrades";

const INACTIVE_TIMEOUT_MS = 10000;

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
    msSinceLastActive: number;

    static getMostReliablePos(p: PlayerInfo) {
        if (p.isInView) {
            return p.pos;
        } else {
            return p.lowResPos;
        }
    } 

    static isActive(p: PlayerInfo): boolean {
        return true;
//        return p.msSinceLastActive < INACTIVE_TIMEOUT_MS;
    }
}