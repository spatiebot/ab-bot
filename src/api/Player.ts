import { Mob } from "./Mob";
import { Pos } from "../bot/pos";
import { Keystate } from "../../ab-protocol/src/types/client";
import { PlayerUpdate } from "./player-update";
import { Upgrades } from "./upgrades";

export class Player extends Mob {

    private readonly updater: PlayerUpdate;
    
    constructor(p: Player = null) {
        super(p);
        if (p != null) {
            this.copyFrom(p);
        }

        this.updater = new PlayerUpdate(this);
    }

    name: string;
    team: number;
    flag: number;
    upgrades: Upgrades = new Upgrades();
    stealth: boolean = false;
    hidden: boolean = false;
    dead: boolean = false;
    energy: number = 1;
    energyRegen: number = 0;
    health: number = 1;
    healthRegen: number = 0;
    lowResPos: Pos = null;
    boost: boolean;
    strafe: boolean;
    keystate: Keystate;
    flagspeed: boolean;
    status: number;
    leftHorizon: boolean = false;

    update(timeFactor: number) {
        this.updater.exec(timeFactor);
    }

    reset() {
        this.energy = 1;
        this.health = 1;
        this.dead = false;
        this.hidden = false;
    }

    leaveHorizon() {
        this.boost = false;
        this.keystate = {} as Keystate;
        this.speedX = 0;
        this.speedY = 0;
        this.upgrades = new Upgrades();
        this.strafe = false;
        this.flagspeed = false;
        this.leftHorizon = true;
    }

    activity() {
        this.leftHorizon = false;
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
  
        if (p.boost != null) {
            this.boost = p.boost;
        }
        if (p.strafe != null) {
            this.strafe = p.strafe;
        }

        if (p.keystate != null) {
            this.keystate = p.keystate;
        }

        if (p.status != null) {
            this.status = p.status;
        }

        if (p.flagspeed != null) {
            this.flagspeed = p.flagspeed;
        }

        if (p.hidden != null) {
            this.hidden = p.hidden;
        }
    }
}