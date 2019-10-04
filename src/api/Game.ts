import { Network } from "./Network";
import { Player } from "./Player";
import { Mob } from "./Mob";
import { Debug } from "../helper/debug";

export class Game {

    private myID: number;
    private players = {};
    private mobs = {};
    private numUpgrades: number;
    private score: number;
    private previousTickTime: number;
    private readonly subscribers = {};
    private ping: number = 30;

    private debugConfig: any;

    constructor(private readonly network: Network) {
    }

    on(eventName: string, subscriber: (x: any) => void) {
        var subs = this.subscribers[eventName];
        subs = subs || [];
        subs.push(subscriber);
        this.subscribers[eventName] = subs;
    }

    private trigger(eventName: string, data: any) {
        var subs = this.subscribers[eventName];
        subs = subs || [];

        for (const sub of subs) {
            sub(data);
        }
    }

    start(name: string, flag: string) {
        this.network.start(this, name, flag);
    }

    getPlayers(): Player[] {
        const result = [];
        for (const id of Object.keys(this.players)) {
            result.push(this.players[id]);
        }
        return result;
    }

    getPlayer(id: number = null): Player {
        return this.players[id];
    }

    getMobs(): Mob[] {
        const result = [];
        for (const id of Object.keys(this.mobs)) {
            result.push(this.mobs[id]);
        }
        return result;
    }

    getMob(id: number): Mob {
        return this.mobs[id];
    }

    getMyId(): number {
        return this.myID;
    }

    getPing(): number {
        return this.ping;
    }

    onTick() {
        const now = Date.now();
        const prevTime = this.previousTickTime || now - 7;
        const framesSinceLastFrame = (now - prevTime) / 16.666; 
        const timeFactor = framesSinceLastFrame > 10 ? 10 : framesSinceLastFrame;
        this.previousTickTime = now;

        for (const p of this.getPlayers()) {
            p.update(timeFactor);
        }

        for (const m of this.getMobs()) {
            m.update(timeFactor);
        }

        this.trigger("tick", {});
    }
    
    onPingPong(ping: number) {
        this.ping = ping;
    }

    onError(error: Error) {
        console.log(error.message, error.stack);
        this.network.stop();
        this.trigger("error", error);
    }

    onStart(myID: number) {
        this.myID = myID;
        console.log("My id: " + myID);
        this.trigger("spawned", {id: myID});
    }

    onRespawn(playerId: number) {
        this.getPlayer(playerId).reset();
        this.trigger("spawned", {id: playerId, respawn: true});
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

    onHit(playerID: number) {
        this.trigger("playerhit", {playerID});
    }

    onKill(playerID: number, killerID: number) {
        this.trigger("playerkilled", {killerID, killedID: playerID});

        if (playerID === this.myID) {
            this.mobs = {}; // we don't get despawn messages if the mob is not in sight.
        }
    }

    onUpgrades(numUpgrades: number) {
        this.numUpgrades = numUpgrades;
        this.trigger("score", {
            upgrades: this.numUpgrades,
            score: this.score
        });
    }

    onScore(score: number) {
        this.score = score;
        this.trigger("score", {
            upgrades: this.numUpgrades,
            score: this.score
        });
    }

    onChat(playerID: number, msg: string) {
        this.trigger("chat", {
            id: playerID,
            text: msg
        });
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

    setDebugProperties(config: any) {
        // use for random debug stuff
        this.debugConfig = config;
    }
}