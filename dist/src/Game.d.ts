import { Network } from "./Network";
import { Player } from "./Player";
import { Mob } from "./Mob";
export declare class Game {
    private network;
    private players;
    private mobs;
    private numUpgrades;
    private score;
    constructor(network: Network);
    start(name: string, flag: string): void;
    getPlayer(id: number): Player;
    getMob(id: number): Mob;
    onStart(myID: number): void;
    onPlayerInfo(player: Player): void;
    onPlayerLeave(playerID: number): void;
    onKill(playerID: number, killerID: number): void;
    onUpgrades(numUpgrades: number): void;
    onScore(score: number): void;
    onChat(playerID: number, msg: string): void;
    onMob(mob: Mob): void;
    onMobDespawned(id: number): void;
}
