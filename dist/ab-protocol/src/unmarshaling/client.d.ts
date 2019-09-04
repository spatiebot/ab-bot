import { Backup, Horizon, Ack, Pong, Key, Command, Chat, Votemute, Localping } from '../schemas/client';
declare const _default: {
    [x: number]: ((buffer: ArrayBuffer) => Backup) | ((buffer: ArrayBuffer) => Horizon) | (() => Ack) | ((buffer: ArrayBuffer) => Pong) | ((buffer: ArrayBuffer) => Key) | ((buffer: ArrayBuffer) => Command) | ((buffer: ArrayBuffer) => Chat) | ((buffer: ArrayBuffer) => Votemute) | ((buffer: ArrayBuffer) => Localping);
};
export default _default;
