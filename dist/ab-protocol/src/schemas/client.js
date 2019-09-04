"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../packets/client"));
const data_1 = require("../types/data");
exports.default = {
    [client_1.default.LOGIN]: [
        ['protocol', data_1.DATA_TYPES.uint8],
        ['name', data_1.DATA_TYPES.text],
        ['session', data_1.DATA_TYPES.text],
        ['horizonX', data_1.DATA_TYPES.uint16],
        ['horizonY', data_1.DATA_TYPES.uint16],
        ['flag', data_1.DATA_TYPES.text],
    ],
    [client_1.default.BACKUP]: [['token', data_1.DATA_TYPES.text]],
    [client_1.default.HORIZON]: [['horizonX', data_1.DATA_TYPES.uint16], ['horizonY', data_1.DATA_TYPES.uint16]],
    [client_1.default.ACK]: [],
    [client_1.default.PONG]: [['num', data_1.DATA_TYPES.uint32]],
    [client_1.default.KEY]: [
        ['seq', data_1.DATA_TYPES.uint32],
        ['key', data_1.DATA_TYPES.uint8],
        ['state', data_1.DATA_TYPES.boolean],
    ],
    [client_1.default.COMMAND]: [['com', data_1.DATA_TYPES.text], ['data', data_1.DATA_TYPES.text]],
    [client_1.default.SCOREDETAILED]: [],
    [client_1.default.CHAT]: [['text', data_1.DATA_TYPES.text]],
    [client_1.default.WHISPER]: [['id', data_1.DATA_TYPES.uint16], ['text', data_1.DATA_TYPES.text]],
    [client_1.default.SAY]: [['text', data_1.DATA_TYPES.text]],
    [client_1.default.TEAMCHAT]: [['text', data_1.DATA_TYPES.text]],
    [client_1.default.VOTEMUTE]: [['id', data_1.DATA_TYPES.uint16]],
    [client_1.default.LOCALPING]: [['auth', data_1.DATA_TYPES.uint32]],
};
//# sourceMappingURL=client.js.map