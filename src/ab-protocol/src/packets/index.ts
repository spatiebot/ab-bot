export interface WSPacket {
  /**
   * Packet code.
   */
  c?: number;
}

export interface ProtocolPacket extends WSPacket {
  [index: string]: {}[] | number | string | boolean;
}
