import * as marshaling from '../ab-protocol/src/marshaling';
import * as unmarshaling from '../ab-protocol/src/unmarshaling';
import CLIENT_PACKETS from '../ab-protocol/src/packets/client';
import SERVER_PACKETS from '../ab-protocol/src/packets/server';
import { KEY_CODES } from '../ab-protocol/src/types/client';
import { decodeMinimapCoords, decodeKeystate, decodeUpgrades } from '../ab-protocol/src/decoding/index';
import WebSocket from 'ws';
import { ProtocolPacket } from '../ab-protocol/src/packets';
import { Game } from './Game';
import { Mob } from './Mob';
import { CHAT_TYPE } from './chat-type';
import { Player } from './Player';
import { Pos } from '../bot/pos';
import { Upgrades } from './upgrades';
import { Logger } from '../helper/logger';
import { StopWatch } from '../helper/timer';
import { TimeoutManager } from '../helper/timeoutManager';

export class Network {
    private client: WebSocket;
    private backupClient: WebSocket;
    private backupClientIsConnected: boolean;
    private ackToBackup: boolean;
    private ackInterval: any;
    private game: Game;
    private keyCount = 0;
    private token: string;
    private lastChat: string;
    private spamWarningTimer = new StopWatch();
    private chatTimeout; 
    private isStopping: boolean;

    constructor(private ws: string, private logger: Logger, private tm: TimeoutManager) {
    }

    start(game: Game, name: string, flag: string) {
        this.isStopping = false;
        this.game = game;
        this.client = this.initWebSocket({
            isPrimary: true,
            name,
            flag
        });
    }

    stop() {
        this.isStopping = true;
        clearInterval(this.ackInterval);
        if (!this.client.closed) {
            this.client.close();
        }
        if (this.backupClientIsConnected) {
            if (!this.backupClient.closed) {
                this.backupClient.close();
            }
            this.backupClientIsConnected = false;
        }
    }

    private initWebSocket(config: any, tries = 1) {
        const ws = new WebSocket(this.ws);
        ws.binaryType = "arraybuffer";

        ws.onopen = () => {
            tries -= 1;
            if (config.isPrimary) {
                this.logger.debug("Primary socket connecting");
                this.send({
                    c: CLIENT_PACKETS.LOGIN,
                    protocol: 5,
                    name: config.name,
                    session: "none",
                    horizonX: Math.ceil(3000),
                    horizonY: Math.ceil(3000),
                    flag: config.flag
                });
            } else {
                this.logger.debug("Backup socket connecting");
                this.backupClientIsConnected = true;
                this.send({
                    c: CLIENT_PACKETS.BACKUP,
                    token: this.token
                }, true);
            }
        };
        ws.onmessage = (msg: { data: ArrayBuffer }) => {
            try {
                const result = unmarshaling.unmarshalServerMessage(msg.data);
                if (!result) {
                    this.logger.warn('no result', msg);
                }
                this.onServerMessage(result, config.isPrimary);

            } catch (error) {
                this.game.onError(error);
            }
        };
        ws.onerror = (ev) => {
            this.game.onError(ev);
        };
        ws.onclose = () => {
            this.logger.warn('socket closed');
            if (config.isPrimary && !this.isStopping) {
                this.game.onDisconnect();
            }
        };
        return ws;
    }

    sendKey(key: KEY_CODES, value: boolean) {
        this.keyCount++;
        const msg = {
            c: CLIENT_PACKETS.KEY,
            seq: this.keyCount,
            key: key,
            state: value
        };
        this.send(msg);
        if (this.backupClientIsConnected) {
            this.send(msg, true);
        }
    }

    sendCommand(command: string, params: string) {
        const msg = {
            c: CLIENT_PACKETS.COMMAND,
            com: command,
            data: params
        };
        this.send(msg);
    }

    chat(type: CHAT_TYPE, text: string, isUrgent: boolean, targetPlayerID: number = null): boolean {
        if (this.lastChat === text) {
            // avoid being muted by the server
            return false;
        }
        if (this.spamWarningTimer.isStarted && this.spamWarningTimer.elapsedSeconds() < 2) {
            // we're about to get muted
            if (!isUrgent || this.chatTimeout) {
                return false;
            }
            this.chatTimeout = this.tm.setTimeout(() => {
                this.chatTimeout = null;
                this.chat(type, text, isUrgent, targetPlayerID);
            }, 1500);
            return true;
        }

        this.lastChat = text;

        let c: number;
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

        const msg = {
            c,
            text,
            id: targetPlayerID
        };

        this.send(msg);

        return true;
    }

    private onServerMessage(msg: ProtocolPacket, isPrimary: boolean) {
        switch (msg.c) {
            case SERVER_PACKETS.BACKUP:
                this.logger.info("backup client connected");
                this.backupClientIsConnected = true;
                break;

            case SERVER_PACKETS.LOGIN:
                this.afterLogin(msg);
                break;

            case SERVER_PACKETS.SCORE_UPDATE:
                this.game.onScore(msg.score as number);
                this.game.onUpgrades(msg.upgrades as number);
                break;

            case SERVER_PACKETS.PLAYER_NEW:
            case SERVER_PACKETS.EVENT_BOOST:
            case SERVER_PACKETS.EVENT_BOUNCE:
                this.game.onPlayerInfo(this.decodePlayer(msg));
                break;

            case SERVER_PACKETS.PLAYER_UPDATE:
                this.game.onPlayerInfo(this.decodePlayer(msg));
                const activePlayer = this.game.getPlayer(msg.id as number);
                if (activePlayer) {
                    activePlayer.activity();
                }
                break;

            case SERVER_PACKETS.PLAYER_RETEAM:
                const teamPlayers = msg.players as any[];
                for (let i = 0; i < teamPlayers.length; i++) {
                    const existingTeamPlayer = this.game.getPlayer(teamPlayers[i].id);
                    if (existingTeamPlayer) {
                        existingTeamPlayer.team = teamPlayers[i].team;
                    }
                }
                break;

            case SERVER_PACKETS.PLAYER_UPGRADE:
                const me = this.game.getPlayer(this.game.getMyId());
                me.appliedUpgrades = <Upgrades>(msg as any);
                break;

            case SERVER_PACKETS.PLAYER_RESPAWN:
                this.game.onPlayerInfo(this.decodePlayer(msg));
                this.game.onRespawn(msg.id as number);
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

                this.game.onPlayerInfo(this.decodePlayer(msg));
                break;

            case SERVER_PACKETS.PLAYER_HIT:
                const hitPlayers = msg.players as Player[];
                for (const hit of hitPlayers) {
                    this.game.onPlayerInfo(this.decodePlayer(hit));
                    this.game.onHit(hit.id);
                }
                break;

            case SERVER_PACKETS.SCORE_BOARD:
                const minimapData = msg.rankings as any[];
                for (let i = 0; i < minimapData.length; i++) {
                    const playerMinimapData = minimapData[i];

                    if (playerMinimapData.x === 0 && playerMinimapData.y === 0) {
                        playerMinimapData.hidden = true;
                    } else {
                        const coords = decodeMinimapCoords(playerMinimapData.x, playerMinimapData.y);
                        playerMinimapData.lowResPos = new Pos(coords);
                        playerMinimapData.lowResPos.isAccurate = false;
                    }
                    this.game.onPlayerInfo(playerMinimapData);
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
                msg.id = msg.id || msg.from;
                this.game.onChat(msg.id as number, msg.text as string);
                break;

            case SERVER_PACKETS.PING:
                this.send({ c: CLIENT_PACKETS.PONG, num: msg.num }, !isPrimary);
                break;

            case SERVER_PACKETS.PING_RESULT:
                this.game.onPingPong(msg.ping as number);
                break;

            case SERVER_PACKETS.EVENT_LEAVEHORIZON:
                const isMob = msg.type !== 0;
                if (isMob) {
                    this.game.onMobDespawned(msg.id as number);
                } else {
                    const playerLeavingHor = this.game.getPlayer(msg.id as number);
                    if (playerLeavingHor) {
                        playerLeavingHor.leaveHorizon();
                    }
                }
                break;

            // ignore
            case SERVER_PACKETS.PLAYER_POWERUP:
                break;

            case SERVER_PACKETS.SERVER_MESSAGE:
                this.game.onServerMessage(msg.text as string);
                break;

            case SERVER_PACKETS.GAME_FLAG:
                this.game.onFlag(msg.flag as number, msg.id as number, msg.posX as number, msg.posY as number);
                this.game.onCtfScore(msg.blueteam as number, msg.redteam as number);
                break;

            case SERVER_PACKETS.SERVER_CUSTOM:
                if (msg.type === 2) {
                    this.game.onCtfGameOver();
                } else {
                    this.logger.warn("Custom server message", msg);
                }
                break;

            case SERVER_PACKETS.COMMAND_REPLY:
                if (msg.type === 0 && msg.text === "Don't spam!") {
                    this.logger.warn("Spam warning received!");
                    this.spamWarningTimer.start();
                }
                break;

            default:
                this.logger.warn("Unknown message type", msg);
                break;
        }
    }

    private decodePlayer(msg: any): Player {
        if (msg.keystate || msg.keystate === 0) {
            const decodedKeyState = decodeKeystate(msg.keystate);
            msg.rawKeystate = msg.keystate;
            msg.keystate = decodedKeyState.keystate;
            msg.boost = decodedKeyState.boost;
            msg.flagspeed = decodedKeyState.flagspeed;
            msg.strafe = decodedKeyState.strafe;
            msg.stealth = decodedKeyState.stealthed;
        }
        if (msg.upgrades || msg.upgrades === 0) {
            const powerUps = decodeUpgrades(msg.upgrades);
            msg.powerUps = powerUps;
        }
        return msg;
    }

    private afterLogin(msg: ProtocolPacket) {
        // send regular ack messages to keep the connection alive
        clearInterval(this.ackInterval);
        this.ackInterval = setInterval(() => {
            this.send({ c: CLIENT_PACKETS.ACK }, this.ackToBackup);
            this.ackToBackup = !this.ackToBackup;
        }, 1000); // original airmash has 50ms, but wights server has a 10 second ack timeout. So.

        this.token = msg.token as string;

        if (this.backupClientIsConnected) {
            this.backupClient.close();
            this.backupClientIsConnected = false;
        }
        this.backupClient = this.initWebSocket({ isPrimary: false });

        // send start info to game
        const players = msg.players as [];
        for (const p of players) {
            const player = p as any;
            player.hidden = player.status === 1;
            this.game.onPlayerInfo(p);
        }
        this.game.onStart(msg.id as number, msg.type as number);
    }

    private send(msg: ProtocolPacket, sendToBackup = false) {
        const clientMgs = marshaling.marshalClientMessage(msg);
        try {
            if (sendToBackup) {
                if (this.backupClientIsConnected) {
                    this.backupClient.send(clientMgs);
                }
            } else {
                this.client.send(clientMgs);
            }
        } catch (error) {
            this.game.onError(error);
        }
    }
}