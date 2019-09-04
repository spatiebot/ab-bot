import { Login, Backup } from '../schemas/client';
declare const _default: {
    [x: number]: ((msg: Login) => ArrayBuffer) | ((msg: Backup) => ArrayBuffer);
};
export default _default;
