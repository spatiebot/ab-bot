import { Network } from "./Network";
import { Player } from "./Player";
import { Mob } from "./Mob";

export class Game {
    private players = {};
    private mobs = {};
    private numUpgrades: number;
    private score: number;

    constructor(private network: Network) {

    }

    start(name: string, flag: string) {
        this.network.start(this, name, flag);
    }

    getPlayer(id: number): Player {
        return this.players[id];
    }

    getMob(id: number): Mob {
        return this.mobs[id];
    }

    onStart(myID: number) {
        console.log("My id: " + myID);
    }

    onPlayerInfo(player: Player) {
        const p = this.getPlayer(player.id);
        if (!p) {
            this.players[player.id] = new Player(player);
        } else {
            p.copyFrom(player);
        }
    }

    onPlayerLeave(playerID: number) {
        delete this.players[playerID];
    }

    onKill(playerID: number, killerID: number) {
        console.log(this.getPlayer(playerID).name + ' was killed by ' + this.getPlayer(killerID).name);
    }

    onUpgrades(numUpgrades: number) {
        this.numUpgrades = numUpgrades;
    }

    onScore(score: number) {
        this.score = score;
    }

    onChat(playerID: number, msg: string) {
        
    }

    onMob(mob: Mob) {
        const m = this.getMob(mob.id);
        if (!m) {
            this.mobs[mob.id] = new Mob(mob);
        } else {
            m.copyFrom(mob);
        }
    }

    onMobDespawned(id: number) {
        delete this.mobs[id];
    }

}