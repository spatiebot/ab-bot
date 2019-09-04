import { Mob } from "./Mob";
export declare class Player extends Mob {
    constructor(p?: Player);
    name: string;
    team: number;
    rot: number;
    flag: number;
    upgrades: number;
    stealth: boolean;
    copyFrom(p: Player): void;
}
