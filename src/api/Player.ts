import { Mob } from "./Mob";
import { Pos } from "../bot/pos";
import { Keystate } from "../ab-protocol/src/types/client";
import { PlayerUpdate } from "./player-update";
import { PowerUps } from "./powerups";
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
    powerUps: PowerUps = new PowerUps();
    appliedUpgrades: Upgrades = new Upgrades();
    stealth = false;
    hidden = false;
    dead = false;
    energy = 1;
    energyRegen = 0;
    health = 1;
    healthRegen = 0;
    lowResPos: Pos = null;
    boost: boolean;
    strafe: boolean;
    keystate: Keystate;
    flagspeed: boolean;
    leftHorizon = false;

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
        this.powerUps = new PowerUps();
        this.strafe = false;
        this.flagspeed = false;
        this.leftHorizon = true;
    }

    activity() {
        this.leftHorizon = false;
    }

    copyFrom(p: Player) {
        super.copyFrom(p);

        let hasMoved = false;

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
            if (!this.lowResPos || this.lowResPos.x !== p.lowResPos.x || this.lowResPos.y !== p.lowResPos.y) {
                hasMoved = true;
            }
            this.lowResPos = p.lowResPos;
        }

        if (p.powerUps != null) {
            this.powerUps = p.powerUps;
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

        if (p.flagspeed != null) {
            this.flagspeed = p.flagspeed;
        }

        if (p.hidden != null) {
            this.hidden = p.hidden;
        }

        if (p.appliedUpgrades != null) {
            this.appliedUpgrades = p.appliedUpgrades;
        }

        if (hasMoved) {
            this.lastMovedTimer.start();
        }
    }
}