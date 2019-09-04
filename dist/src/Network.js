"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const marshaling = __importStar(require("../ab-protocol/src/marshaling"));
const unmarshaling = __importStar(require("../ab-protocol/src/unmarshaling"));
const client_1 = __importDefault(require("../ab-protocol/src/packets/client"));
const server_1 = __importDefault(require("../ab-protocol/src/packets/server"));
const ws_1 = __importDefault(require("ws"));
const chat_type_1 = require("./chat-type");
class Network {
    constructor(ws) {
        this.ws = ws;
        this.keyCount = 0;
    }
    start(game, name, flag) {
        this.game = game;
        this.client = new ws_1.default(this.ws);
        this.client.binaryType = "arraybuffer";
        this.client.onopen = () => {
            this.send({
                c: client_1.default.LOGIN,
                protocol: 5,
                name,
                session: "none",
                horizonX: Math.ceil(640),
                horizonY: Math.ceil(480),
                flag
            });
        };
        this.client.onmessage = (msg) => {
            const result = unmarshaling.unmarshalServerMessage(msg.data);
            console.log(result);
            this.onServerMessage(result);
        };
    }
    sendKey(key, value) {
        this.keyCount++;
        var msg = {
            c: client_1.default.KEY,
            seq: this.keyCount,
            key: key,
            state: value
        };
        this.send(msg);
    }
    sendCommand(command, params) {
        {
            var msg = {
                c: client_1.default.COMMAND,
                com: command,
                data: params
            };
            this.send(msg);
        }
    }
    chat(type, text, targetPlayerID = null) {
        var c;
        switch (type) {
            case chat_type_1.CHAT_TYPE.CHAT:
                c = client_1.default.CHAT;
                break;
            case chat_type_1.CHAT_TYPE.SAY:
                c = client_1.default.SAY;
                break;
            case chat_type_1.CHAT_TYPE.TEAM:
                c = client_1.default.TEAMCHAT;
                break;
            case chat_type_1.CHAT_TYPE.WHISPER:
                c = client_1.default.WHISPER;
                break;
        }
        var msg = {
            c,
            text,
            id: targetPlayerID
        };
        this.send(msg);
    }
    onServerMessage(msg) {
        switch (msg.c) {
            case server_1.default.LOGIN:
                this.initialize(msg);
                break;
            case server_1.default.SCORE_UPDATE:
                this.game.onScore(msg.score);
                this.game.onUpgrades(msg.upgrades);
                break;
            case server_1.default.PLAYER_NEW:
            case server_1.default.PLAYER_UPDATE:
            case server_1.default.PLAYER_RESPAWN:
                this.game.onPlayerInfo(msg);
                break;
            case server_1.default.PLAYER_TYPE:
                const p = this.game.getPlayer(msg.id);
                if (p) {
                    p.type = msg.type;
                }
                break;
            case server_1.default.PLAYER_KILL:
                this.game.onKill(msg.id, msg.killer);
                break;
            case server_1.default.PLAYER_LEAVE:
                this.game.onPlayerLeave(msg.id);
                break;
            case server_1.default.PLAYER_FIRE:
                const playerID = msg.id;
                const missiles = msg.projectiles;
                for (const missile of missiles) {
                    missile.ownerID = playerID;
                    this.game.onMob(missile);
                }
                break;
            case server_1.default.MOB_UPDATE_STATIONARY:
                const mob1 = msg;
                mob1.stationary = true;
                this.game.onMob(mob1);
                break;
            case server_1.default.MOB_UPDATE:
                const mob2 = msg;
                this.game.onMob(mob2);
                break;
            case server_1.default.MOB_DESPAWN:
            case server_1.default.MOB_DESPAWN_COORDS:
                this.game.onMobDespawned(msg.id);
                break;
            case server_1.default.EVENT_REPEL:
                const goliID = msg.id;
                const repelledMobs = msg.mobs;
                for (const repelledMob of repelledMobs) {
                    repelledMob.ownerID = goliID;
                    this.game.onMob(repelledMob);
                }
                break;
            case server_1.default.EVENT_STEALTH:
                const prowler = this.game.getPlayer(msg.id);
                if (prowler) {
                    prowler.stealth = msg.state;
                }
                break;
            case server_1.default.CHAT_PUBLIC:
            case server_1.default.CHAT_TEAM:
            case server_1.default.CHAT_SAY:
            case server_1.default.CHAT_WHISPER:
                this.game.onChat(msg.id, msg.text);
                break;
            case server_1.default.PING:
            case server_1.default.SCORE_BOARD:
            case server_1.default.EVENT_BOOST:
            case server_1.default.EVENT_BOUNCE:
            case server_1.default.EVENT_LEAVEHORIZON:
            case server_1.default.PLAYER_HIT:
                break;
            case server_1.default.PLAYER_POWERUP:
                break;
            default:
                console.log(msg);
                break;
        }
    }
    initialize(msg) {
        setInterval(() => this.send({ c: client_1.default.ACK }), 50);
        const players = msg.players;
        for (const p of players) {
            this.game.onPlayerInfo(p);
        }
        this.game.onStart(msg.id);
    }
    send(msg) {
        this.client.send(marshaling.marshalClientMessage(msg));
    }
}
exports.Network = Network;
//# sourceMappingURL=Network.js.map