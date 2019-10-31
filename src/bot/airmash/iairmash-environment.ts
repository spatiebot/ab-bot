import { PlayerInfo } from "./player-info";
import { Crate } from "./crate";
import { Missile } from "./missile";
import { FlagInfo } from "../../api/flagInfo";

export interface IAirmashEnvironment {

    startMainLoop();
    stopMainLoop();

    joinGame(name: string, flag: string);
    selectAircraft(type: number);
    getGameType(): number;

    on(what: string, subscriber: (e: any) => any): number;
    off(what: string, subscriberId);

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

    sendChat(msg: string, isUrgent: boolean): boolean;
    sendSay(msg: string, isUrgent: boolean ): boolean;
    sendTeam(msg: string, isUrgent: boolean): boolean;
    sendWhisper(msg: string, isUrgent: boolean, targetPlayerId: number): boolean;
    sendCommand(command: string, args: string);

    getFlagInfo(team: number): FlagInfo;
    getCtfScores(): { 1: number; 2: number };

    setDebugProperties(config: any);
}