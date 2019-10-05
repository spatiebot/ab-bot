import { PlayerInfo } from "./player-info";
import { PathFinding } from "../instructions/path-finding";
import { Crate } from "./crate";
import { Missile } from "./missile";
import { FlagInfo } from "../../api/flagInfo";

export interface IAirmashEnvironment {

    startMainLoop();
    stopMainLoop();

    joinGame(name: string, flag: string);
    selectAircraft(type: number);
    getGameType(): number;

    on(what: string, subscriber: (e: any) => any);

    me(): PlayerInfo;
    myId(): number;
    getPlayers(): PlayerInfo[];
    getPlayer(id: number): PlayerInfo;
    getMyKeyState(): any;

    getCrates(): Crate[];
    getCrate(id: number): Crate;
    getMissiles(): Missile[];
    getMissile(id: number): Missile;

    getWalls(): number[][];

    sendKey(key: string, value: boolean);

    getPing(): number;

    sendChat(msg: string);
    sendSay(msg: string);
    sendCommand(command: string, args: string);

    getFlagInfo(team: number): FlagInfo;

    setDebugProperties(config: any);
}