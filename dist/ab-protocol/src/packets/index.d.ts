export interface WSPacket {
    c?: number;
}
export interface ProtocolPacket extends WSPacket {
    [index: string]: {}[] | number | string | boolean;
}
