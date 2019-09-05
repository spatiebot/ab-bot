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
import { KEY_CODES } from "../../../ab-protocol/src/types/client";
import { CHAT_TYPE } from "../../api/chat-type";
import { Debug } from "../../helper/debug";

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

    joinGame(name: string, flag: string, aircraftType: number) {
        this.game.start(name, flag);
    }

    on(what: string, subscriber: (e: any) => void) {
        this.game.on(what, subscriber);
    }

    getWalls(): number[][] {
        return walls;
    }

    me(): PlayerInfo {
        return this.getPlayerFrom(this.game.getPlayer(this.game.getMyId()));
    }

    private getPlayerFrom(p: Player): PlayerInfo {
        if (!p) {
            return null;
        }

        return {
            energy: p.energy,
            health: p.health,
            id: p.id,
            isHidden: p.posX === 0 && p.posY === 0 || p.lowResPos && p.lowResPos.x === 0 && p.lowResPos.y === 0,
            isInView: !p.isStale(),
            isStealthed: p.stealth,
            lowResPos: p.lowResPos,
            name: p.name,
            pos: new Pos({ x: p.posX, y: p.posY }),
            rot: p.rot,
            speed: new Pos({ x: p.speedX, y: p.speedY }),
            team: p.team,
            type: p.type
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
        return 20;
    }

    sendChat(msg: string) {
        this.network.chat(CHAT_TYPE.CHAT, msg);
    }

    sendSay(msg: string) {
        this.network.chat(CHAT_TYPE.SAY, msg);
    }

    sendCommand(command: string, args: string) {
        this.sendCommand(command, args);
    }

    setDebugProperties(config: any) {
        // use for random debugging stuff
        this.game.setDebugProperties(config);
    }

}