import { ProtocolPacket } from '../packets';
declare const marshalClientMessage: (message: ProtocolPacket, usePredefinedMarshal?: boolean) => ArrayBuffer;
declare const marshalServerMessage: (message: ProtocolPacket, usePredefinedMarshal?: boolean) => ArrayBuffer;
export { marshalClientMessage, marshalServerMessage };
