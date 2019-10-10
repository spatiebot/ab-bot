import { Network } from "./Network";
import { Player } from "./Player";
import { Mob } from "./Mob";
import { Debug } from "../helper/debug";
import { FlagInfo } from "./flagInfo";
import { Pos } from "../bot/pos";

export class Game {

    public type: number;
    public readonly blueFlag = new FlagInfo(1);
    public readonly redFlag = new FlagInfo(2);

    private myID: number;
    private players = {};
    private mobs = {};
    private numUpgrades: number;
    private score: number;
    private previousTickTime: number;
    private readonly subscribers = {};
    private ping: number = 30;
    private tickDurations: any = {};

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

        this.tickDurations.updatePlayers = Date.now() - now;

        for (const m of this.getMobs()) {
            m.update(timeFactor);
        }

        this.tickDurations.updateMobs = Date.now() - now;

        this.trigger("tick", {});

        this.tickDurations.tick = Date.now() - now;

    }

    onPingPong(ping: number) {
        this.ping = ping;
    }

    onError(error: Error) {
        console.log(error.message, error.stack);
        this.network.stop();
        this.trigger("error", error);
    }

    onStart(myID: number, gameType: number) {
        this.trigger("start", {});
        this.myID = myID;
        this.type = gameType;
        console.log("My id: " + myID);
        this.trigger("spawned", { id: myID, gameType });
    }

    onRespawn(playerId: number) {
        this.getPlayer(playerId).reset();
        this.trigger("spawned", { id: playerId, respawn: true });
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
        this.trigger("playerhit", { playerID });
    }

    onKill(playerID: number, killerID: number) {
        this.trigger("playerkilled", { killerID, killedID: playerID });

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

    onServerMessage(text: string) {
        console.log("Server message: " + text);
        this.trigger("serverMessage", { text });
    }

    onCtfGameOver() {
        this.trigger("ctfGameOver", {});
    }

    onFlagDropped(flag: number, posX: number, posY: number) {
        let flagInfo = this.blueFlag;
        if (flag === 2) {
            flagInfo = this.redFlag;
        }
        flagInfo.carrierId = null;
        flagInfo.pos = new Pos({ x: posX, y: posY });

        this.trigger("flag", {
            redFlag: this.redFlag,
            blueFlag: this.blueFlag
        });
    }

    onFlagTaken(flag: number, playerId: number) {
        let flagInfo = this.blueFlag;
        if (flag === 2) {
            flagInfo = this.redFlag;
        }
        flagInfo.carrierId = playerId;

        this.trigger("flag", {
            redFlag: this.redFlag,
            blueFlag: this.blueFlag
        });
    }


    setDebugProperties(config: any) {
        // use for random debug stuff
        this.debugConfig = config;
    }
}