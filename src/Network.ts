import * as marshaling from '../ab-protocol/src/marshaling';
import * as unmarshaling from '../ab-protocol/src/unmarshaling';
import CLIENT_PACKETS from '../ab-protocol/src/packets/client';
import SERVER_PACKETS from '../ab-protocol/src/packets/server';
import { KEY_CODES } from '../ab-protocol/src/types/client';
import WebSocket from 'ws';
import { ProtocolPacket } from '../ab-protocol/src/packets';
import { Game } from './Game';
import { Mob } from './Mob';
import { CHAT_TYPE } from './chat-type';

export class Network {
    private client: WebSocket;
    private game: Game;
    private keyCount: number = 0;

    constructor(private ws: string) {
    }

    start(game: Game, name: string, flag: string) {
        this.game = game;
        this.client = new WebSocket(this.ws);
        this.client.binaryType = "arraybuffer";

        this.client.onopen = () => {
            this.send({
                c: CLIENT_PACKETS.LOGIN,
                protocol: 5,
                name,
                session: "none",
                horizonX: Math.ceil(640),
                horizonY: Math.ceil(480),
                flag
            });
        };
        this.client.onmessage = (msg: { data: ArrayBuffer; }) => {
            const result = unmarshaling.unmarshalServerMessage(msg.data);
            this.onServerMessage(result);
        };
    }

    sendKey(key: KEY_CODES, value: boolean) {
        this.keyCount++;
        var msg = {
            c: CLIENT_PACKETS.KEY,
            seq: this.keyCount,
            key: key,
            state: value
        };
        this.send(msg);
    }

    sendCommand(command: string, params: string) {
        {
            var msg = {
                c: CLIENT_PACKETS.COMMAND,
                com: command,
                data: params
            };
            this.send(msg);
        }
    }

    chat(type: CHAT_TYPE, text: string, targetPlayerID: number = null) {
        var c: number;
        switch (type) {
            case CHAT_TYPE.CHAT:
                c = CLIENT_PACKETS.CHAT;
                break;
            case CHAT_TYPE.SAY:
                c = CLIENT_PACKETS.SAY;
                break;
            case CHAT_TYPE.TEAM:
                c = CLIENT_PACKETS.TEAMCHAT;
                break;
            case CHAT_TYPE.WHISPER:
                c = CLIENT_PACKETS.WHISPER;
                break;
        }

        var msg = {
            c,
            text,
            id: targetPlayerID
        };
        this.send(msg);
    }

    private onServerMessage(msg: ProtocolPacket) {
        switch (msg.c) {
            case SERVER_PACKETS.LOGIN:
                this.initialize(msg);
                break;

            case SERVER_PACKETS.SCORE_UPDATE:
                this.game.onScore(msg.score as number);
                this.game.onUpgrades(msg.upgrades as number);
                break;

            case SERVER_PACKETS.PLAYER_NEW:
            case SERVER_PACKETS.PLAYER_UPDATE:
            case SERVER_PACKETS.PLAYER_RESPAWN:
                this.game.onPlayerInfo(msg as any);
                break;

            case SERVER_PACKETS.PLAYER_TYPE:
                const p = this.game.getPlayer(msg.id as number);
                if (p) {
                    p.type = msg.type as number;
                }
                break;

            case SERVER_PACKETS.PLAYER_KILL:
                const killed = this.game.getPlayer(msg.id as number);
                if (killed) {
                    killed.dead = true;
                }

                this.game.onKill(msg.id as number, msg.killer as number);
                break;

            case SERVER_PACKETS.PLAYER_LEAVE:
                this.game.onPlayerLeave(msg.id as number);
                break;

            case SERVER_PACKETS.PLAYER_FIRE:
                const playerID = msg.id as number;
                const missiles = msg.projectiles as Mob[];
                for (const missile of missiles) {
                    missile.ownerID = playerID;
                    this.game.onMob(missile);
                }
                break;

            case SERVER_PACKETS.MOB_UPDATE_STATIONARY:
                const mob1 = msg as any;
                mob1.stationary = true;
                this.game.onMob(mob1);
                break;

            case SERVER_PACKETS.MOB_UPDATE:
                const mob2 = msg as any;
                this.game.onMob(mob2);
                break;

            case SERVER_PACKETS.MOB_DESPAWN:
            case SERVER_PACKETS.MOB_DESPAWN_COORDS:
                this.game.onMobDespawned(msg.id as number);
                break;

            case SERVER_PACKETS.EVENT_REPEL:
                const goliID = msg.id as number;
                const repelledMobs = msg.mobs as Mob[];
                for (const repelledMob of repelledMobs) {
                    repelledMob.ownerID = goliID; // mob changes owner on repellation
                    this.game.onMob(repelledMob);
                }
                break;

            case SERVER_PACKETS.EVENT_STEALTH:
                const prowler = this.game.getPlayer(msg.id as number);
                if (prowler) {
                    prowler.stealth = msg.state as boolean;
                }
                break;

            case SERVER_PACKETS.CHAT_PUBLIC:
            case SERVER_PACKETS.CHAT_TEAM:
            case SERVER_PACKETS.CHAT_SAY:
            case SERVER_PACKETS.CHAT_WHISPER:
                this.game.onChat(msg.id as number, msg.text as string);
                break;

            //ignore
            case SERVER_PACKETS.PING:
            case SERVER_PACKETS.SCORE_BOARD:
            case SERVER_PACKETS.EVENT_BOOST:
            case SERVER_PACKETS.EVENT_BOUNCE:
            case SERVER_PACKETS.EVENT_LEAVEHORIZON:
            case SERVER_PACKETS.PLAYER_HIT:
                break;

            // todo
            case SERVER_PACKETS.PLAYER_POWERUP:
                break;

            default:
                console.log(msg);
                break;
        }
    }

    private initialize(msg: ProtocolPacket) {
        // send regular ack messages to keep the connection alive
        setInterval(() => this.send({ c: CLIENT_PACKETS.ACK }), 50);

        // send start info to game
        const players = msg.players as [];
        for (const p of players) {
            this.game.onPlayerInfo(p);
        }
        this.game.onStart(msg.id as number);
    }

    private send(msg: ProtocolPacket) {
        this.client.send(marshaling.marshalClientMessage(msg));
    }

}