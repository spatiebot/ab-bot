import { Mob } from "./Mob";

export class Player extends Mob {

    constructor(p: Player = null) {
        super(p);
        if (p != null) {
            this.copyFrom(p);
        }
    }

    name: string;
    team: number;
    rot: number;
    flag: number;
    upgrades: number;
    stealth: boolean;
    dead: boolean;
    
    copyFrom(p: Player) {
        super.copyFrom(p);
        this.name = p.name || this.name;
        this.team = p.team || this.team;
        this.flag = p.flag || this.flag;        

        this.rot = p.rot;
        this.upgrades = p.upgrades;
    }
}