import { Mob } from "./Mob";
import { Pos } from "../bot/pos";

export class Player extends Mob {

    constructor(p: Player = null) {
        super(p);
        if (p != null) {
            this.copyFrom(p);
        }
    }

    name: string;
    team: number;
    flag: number;
    upgrades: number = 0;
    stealth: boolean = false;
    dead: boolean = false;
    energy: number = 1;
    energyRegen: number = 0;
    health: number = 1;
    healthRegen: number = 0;
    lowResPos: Pos = null;

    update(timeFactor: number) {
        this.energy += timeFactor * this.energyRegen;
        this.energy = Math.min(1, this.energy);
        this.health += timeFactor * this.healthRegen;
        this.health = Math.min(1, this.health);
    }

    reset() {
        this.energy = 1;
        this.health = 1;
        this.dead = false;
    }

    copyFrom(p: Player) {
        super.copyFrom(p);
        this.name = p.name || this.name;
        this.team = p.team || this.team;
        this.flag = p.flag || this.flag;
        this.health = p.health || this.health || 1;
        this.healthRegen = p.healthRegen || this.healthRegen;
        this.energy = p.energy || this.energy || 1;
        this.energyRegen = p.energyRegen || this.energyRegen;
        this.lowResPos = p.lowResPos || this.lowResPos;

        this.upgrades = p.upgrades || 0;
    }
}