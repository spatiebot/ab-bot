import { PlayerInfo } from "./player-info";
import { PathFinding } from "../instructions/path-finding";
import { Crate } from "./crate";
import { Missile } from "./missile";

export interface IAirmashEnvironment {

    startMainLoop();
    stopMainLoop();

    joinGame(name: string, flag: string, aircraftType: number);

    on(what: string, subscriber: (e: any) => any);

    me(): PlayerInfo;
    myId(): number;
    getPlayers(): PlayerInfo[];
    getPlayer(id: number): PlayerInfo;

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
}