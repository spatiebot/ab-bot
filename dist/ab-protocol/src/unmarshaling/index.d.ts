import { ProtocolPacket } from '../packets';
declare const unmarshalClientMessage: (message: ArrayBuffer, usePredefinedMarshal?: boolean) => ProtocolPacket;
declare const unmarshalServerMessage: (message: ArrayBuffer, usePredefinedMarshal?: boolean) => ProtocolPacket;
export { unmarshalClientMessage, unmarshalServerMessage };
