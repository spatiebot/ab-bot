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
        if (p.name != null) {
            this.name = p.name;
        }
        if (p.team != null) {
            this.team = p.team;
        }
        if (p.flag != null) {
            this.flag = p.flag;
        }

        if (p.health != null) {
            this.health = p.health;
        }

        if (p.healthRegen != null) {
            this.healthRegen = p.healthRegen;
        }
        if (p.energy != null) {
            this.energy = p.energy;
        }
        if (p.energyRegen != null) {
            this.energyRegen = p.energyRegen;
        }
        if (p.lowResPos != null) {
            this.lowResPos = p.lowResPos;
        }

        if (p.upgrades != null) {
            this.upgrades = p.upgrades;
        }
    }
}