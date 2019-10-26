import { IAirmashEnvironment } from "./iairmash-environment";
import { Network } from "../../api/Network";
import { Game } from "../../api/Game";
import { walls } from "./walls";
import { PlayerInfo } from "./player-info";
import { Player } from "../../api/Player";
import { Pos } from "../pos";
import { Crate } from "./crate";
import { Mob } from "../../api/Mob";
import { Missile } from "./missile";
import { KEY_CODES } from "../../ab-protocol/src/types/client";
import { CHAT_TYPE } from "../../api/chat-type";
import { FlagInfo } from "../../api/flagInfo";

export class AirmashApiFacade implements IAirmashEnvironment {

    private network: Network;
    private game: Game;
    private mainLoop: any;

    constructor(url: string) {
        this.network = new Network(url);
        this.game = new Game(this.network);
    }

    startMainLoop() {
        this.mainLoop = this.mainLoop || setInterval(() => this.main(), 7);
    }
    stopMainLoop() {
        clearInterval(this.mainLoop);
    }
    private main() {
        try {
            this.game.onTick();
        } catch (error) {
            this.game.onError(error);
        }
    }

    joinGame(name: string, flag: string) {
        this.game.start(name, flag);
    }

    selectAircraft(type: number) {
        this.network.sendCommand("respawn", type.toString());
    }

    on(what: string, subscriber: (e: any) => void): number {
        return this.game.on(what, subscriber);
    }

    off(what: string, subscriptionID: number) {
        this.game.off(what, subscriptionID);
    }
    
    getWalls(): number[][] {
        return walls;
    }

    getFlagInfo(team: number): FlagInfo {
        return team === 1 ? this.game.blueFlag : this.game.redFlag;
    }

    getCtfScores(): { 1: number, 2: number} {
        return this.game.ctfScores;
    }

    me(): PlayerInfo {
        return this.getPlayerFrom(this.game.getPlayer(this.game.getMyId()));
    }

    getGameType(): number {
        return this.game.type;
    }

    private getPlayerFrom(p: Player): PlayerInfo {
        if (!p) {
            return null;
        }

        const isSuspiciouslyCentered = !p.posX && !p.posY && !p.rot;
        const isStale = p.isStale() || p.leftHorizon;

        return {
            energy: p.energy,
            health: p.health,
            id: p.id,
            isHidden: p.dead || p.hidden || isSuspiciouslyCentered,
            isInView: !isStale,
            isStealthed: p.stealth,
            lowResPos: p.lowResPos,
            name: p.name,
            pos: isStale ? p.lowResPos : { x: p.posX, y: p.posY, isAccurate: true },
            rot: p.rot,
            speed: new Pos({ x: p.speedX, y: p.speedY }),
            team: p.team,
            type: p.type,
            hasInferno: p.powerUps && p.powerUps.inferno,
            hasShield: p.powerUps && p.powerUps.shield,
            upgrades: p.appliedUpgrades
        }
    }

    getMyKeyState(): any {
        const me = this.game.getPlayer(this.game.getMyId());
        if (!me.keystate) {
            return {};
        }
        return {
            DOWN: me.keystate.DOWN,
            LEFT: me.keystate.LEFT,
            RIGHT: me.keystate.RIGHT,
            UP: me.keystate.UP,
            SPECIAL: me.boost || me.strafe,
        }
    }

    myId(): number {
        return this.game.getMyId();
    }

    getPlayers(): PlayerInfo[] {
        return this.game.getPlayers().map(x => this.getPlayerFrom(x));
    }

    getPlayer(id: number): PlayerInfo {
        return this.getPlayerFrom(this.game.getPlayer(id));
    }

    getCrates(): Crate[] {
        const mobs = this.game.getMobs();
        const crates = mobs.filter(x => x.stationary);
        return crates.map(x => this.getCrateFrom(x));
    }

    private getCrateFrom(m: Mob): Crate {
        if (!m) {
            return null;
        }
        return {
            id: m.id,
            pos: new Pos({ x: m.posX, y: m.posY }),
            type: m.type
        };
    }

    getCrate(id: number): Crate {
        return this.getCrateFrom(this.game.getMob(id));
    }

    getMissiles(): Missile[] {
        const mobs = this.game.getMobs();
        const missiles = mobs.filter(x => !x.stationary);

        const mapped = missiles.map(x => this.getMissileFrom(x));
        return mapped;
    }

    private getMissileFrom(m: Mob): Missile {
        if (!m) {
            return null;
        }

        return {
            id: m.id,
            pos: new Pos({ x: m.posX, y: m.posY }),
            rot: m.rot,
            playerID: m.ownerID,
            speed: new Pos({ x: m.speedX, y: m.speedY }),
            type: m.type
        };
    }

    getMissile(id: number): Missile {
        return this.getMissileFrom(this.game.getMob(id));
    }

    sendKey(keyName: string, value: boolean) {
        let key: KEY_CODES;
        switch (keyName) {
            case 'UP':
                key = KEY_CODES.UP;
                break;

            case 'DOWN':
                key = KEY_CODES.DOWN;
                break;

            case 'LEFT':
                key = KEY_CODES.LEFT;
                break;

            case 'RIGHT':
                key = KEY_CODES.RIGHT;
                break;

            case 'SPECIAL':
                key = KEY_CODES.SPECIAL;
                break;

            case 'FIRE':
                key = KEY_CODES.FIRE;
                break;

        }
        this.network.sendKey(key, value);
    }

    getPing(): number {
        return this.game.getPing();
    }

    sendChat(msg: string) {
        this.network.chat(CHAT_TYPE.CHAT, msg);
    }

    sendSay(msg: string) {
        this.network.chat(CHAT_TYPE.SAY, msg);
    }

    sendTeam(msg: string) {
        this.network.chat(CHAT_TYPE.TEAM, msg);
    }

    sendWhisper(msg: string, targetPlayerId: number) {
        this.network.chat(CHAT_TYPE.WHISPER, msg, targetPlayerId);
    }

    sendCommand(command: string, args: string) {
        this.network.sendCommand(command, args);
    }

    setDebugProperties(config: any) {
        // use for random debugging stuff
        this.game.setDebugProperties(config);
    }

}