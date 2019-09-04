import { DATA_TYPES } from '../types/data';
import { WSPacket } from '../packets';
export interface Login extends WSPacket {
    protocol?: number;
    name?: string;
    session?: string;
    horizonX?: number;
    horizonY?: number;
    flag?: string;
}
export interface Backup extends WSPacket {
    token?: string;
}
export interface Horizon extends WSPacket {
    horizonX?: number;
    horizonY?: number;
}
export interface Ack extends WSPacket {
}
export interface Pong extends WSPacket {
    num?: number;
}
export interface Key extends WSPacket {
    seq?: number;
    key?: number;
    state?: boolean;
}
export interface Command extends WSPacket {
    com?: string;
    data?: string;
}
export interface Scoredetailed extends WSPacket {
}
export interface Chat extends WSPacket {
    text?: string;
}
export interface Whisper extends WSPacket {
    id?: number;
    text?: string;
}
export interface Say extends WSPacket {
    text?: string;
}
export interface Teamchat extends WSPacket {
    text?: string;
}
export interface Votemute extends WSPacket {
    id?: number;
}
export interface Localping extends WSPacket {
    auth?: number;
}
declare const _default: {
    [x: number]: (string | DATA_TYPES)[][];
};
export default _default;
