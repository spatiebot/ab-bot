export declare class Mob {
    constructor(m: Mob);
    id: number;
    ownerID: number;
    type: number;
    posX: number;
    posY: number;
    stationary: boolean;
    speedX: number;
    speedY: number;
    lastUpdate: number;
    isStale(): boolean;
    copyFrom(m: Mob): void;
}
