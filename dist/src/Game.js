"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = require("./Player");
const Mob_1 = require("./Mob");
class Game {
    constructor(network) {
        this.network = network;
        this.players = {};
        this.mobs = {};
    }
    start(name, flag) {
        this.network.start(this, name, flag);
    }
    getPlayer(id) {
        return this.players[id];
    }
    getMob(id) {
        return this.mobs[id];
    }
    onStart(myID) {
        console.log("My id: " + myID);
    }
    onPlayerInfo(player) {
        const p = this.getPlayer(player.id);
        if (!p) {
            this.players[player.id] = new Player_1.Player(player);
        }
        else {
            p.copyFrom(player);
        }
    }
    onPlayerLeave(playerID) {
        delete this.players[playerID];
    }
    onKill(playerID, killerID) {
        console.log(this.getPlayer(playerID).name + ' was killed by ' + this.getPlayer(killerID).name);
    }
    onUpgrades(numUpgrades) {
        this.numUpgrades = numUpgrades;
    }
    onScore(score) {
        this.score = score;
    }
    onChat(playerID, msg) {
    }
    onMob(mob) {
        const m = this.getMob(mob.id);
        if (!m) {
            this.mobs[mob.id] = new Mob_1.Mob(mob);
        }
        else {
            m.copyFrom(mob);
        }
    }
    onMobDespawned(id) {
        delete this.mobs[id];
    }
}
exports.Game = Game;
//# sourceMappingURL=Game.js.map