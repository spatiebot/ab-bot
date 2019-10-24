/* eslint-disable @typescript-eslint/no-empty-interface */
import CLIENT_PACKETS from '../packets/client';
import { DATA_TYPES } from '../types/data';

export default {
  [CLIENT_PACKETS.LOGIN]: [
    ['protocol', DATA_TYPES.uint8],
    ['name', DATA_TYPES.text],
    ['session', DATA_TYPES.text],
    ['horizonX', DATA_TYPES.uint16],
    ['horizonY', DATA_TYPES.uint16],
    ['flag', DATA_TYPES.text],
  ],
  [CLIENT_PACKETS.BACKUP]: [['token', DATA_TYPES.text]],
  [CLIENT_PACKETS.HORIZON]: [['horizonX', DATA_TYPES.uint16], ['horizonY', DATA_TYPES.uint16]],
  [CLIENT_PACKETS.ACK]: [],
  [CLIENT_PACKETS.PONG]: [['num', DATA_TYPES.uint32]],
  [CLIENT_PACKETS.KEY]: [
    ['seq', DATA_TYPES.uint32],
    ['key', DATA_TYPES.uint8],
    ['state', DATA_TYPES.boolean],
  ],
  [CLIENT_PACKETS.COMMAND]: [['com', DATA_TYPES.text], ['data', DATA_TYPES.text]],
  [CLIENT_PACKETS.SCOREDETAILED]: [],
  [CLIENT_PACKETS.CHAT]: [['text', DATA_TYPES.text]],
  [CLIENT_PACKETS.WHISPER]: [['id', DATA_TYPES.uint16], ['text', DATA_TYPES.text]],
  [CLIENT_PACKETS.SAY]: [['text', DATA_TYPES.text]],
  [CLIENT_PACKETS.TEAMCHAT]: [['text', DATA_TYPES.text]],
  [CLIENT_PACKETS.VOTEMUTE]: [['id', DATA_TYPES.uint16]],
  [CLIENT_PACKETS.LOCALPING]: [['auth', DATA_TYPES.uint32]],
};
