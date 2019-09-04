import { KEY_CODES } from '../ab-protocol/src/types/client';
import { Game } from './Game';
import { CHAT_TYPE } from './chat-type';
export declare class Network {
    private ws;
    private client;
    private game;
    private keyCount;
    constructor(ws: string);
    start(game: Game, name: string, flag: string): void;
    sendKey(key: KEY_CODES, value: boolean): void;
    sendCommand(command: string, params: string): void;
    chat(type: CHAT_TYPE, text: string, targetPlayerID?: number): void;
    private onServerMessage;
    private initialize;
    private send;
}
