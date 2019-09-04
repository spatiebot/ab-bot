"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../packets/client"));
const utils_1 = require("../support/utils");
exports.default = {
    [client_1.default.LOGIN]: (buffer) => {
        const msg = { c: 0 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.protocol = dataView.getUint8(readIndex);
        readIndex += 1;
        {
            const stringLength = dataView.getUint8(readIndex);
            const encodedString = new Uint8Array(stringLength);
            readIndex += 1;
            for (let charIndex = 0; charIndex < stringLength; charIndex += 1) {
                encodedString[charIndex] = dataView.getUint8(readIndex + charIndex);
            }
            msg.name = utils_1.decodeUTF8(encodedString);
            readIndex += stringLength;
        }
        {
            const stringLength = dataView.getUint8(readIndex);
            const encodedString = new Uint8Array(stringLength);
            readIndex += 1;
            for (let charIndex = 0; charIndex < stringLength; charIndex += 1) {
                encodedString[charIndex] = dataView.getUint8(readIndex + charIndex);
            }
            msg.session = utils_1.decodeUTF8(encodedString);
            readIndex += stringLength;
        }
        msg.horizonX = dataView.getUint16(readIndex, true);
        readIndex += 2;
        msg.horizonY = dataView.getUint16(readIndex, true);
        readIndex += 2;
        {
            const stringLength = dataView.getUint8(readIndex);
            const encodedString = new Uint8Array(stringLength);
            readIndex += 1;
            for (let charIndex = 0; charIndex < stringLength; charIndex += 1) {
                encodedString[charIndex] = dataView.getUint8(readIndex + charIndex);
            }
            msg.flag = utils_1.decodeUTF8(encodedString);
            readIndex += stringLength;
        }
        return msg;
    },
    [client_1.default.BACKUP]: (buffer) => {
        const msg = { c: 1 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        {
            const stringLength = dataView.getUint8(readIndex);
            const encodedString = new Uint8Array(stringLength);
            readIndex += 1;
            for (let charIndex = 0; charIndex < stringLength; charIndex += 1) {
                encodedString[charIndex] = dataView.getUint8(readIndex + charIndex);
            }
            msg.token = utils_1.decodeUTF8(encodedString);
            readIndex += stringLength;
        }
        return msg;
    },
    [client_1.default.HORIZON]: (buffer) => {
        const msg = { c: 2 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.horizonX = dataView.getUint16(readIndex, true);
        readIndex += 2;
        msg.horizonY = dataView.getUint16(readIndex, true);
        readIndex += 2;
        return msg;
    },
    [client_1.default.ACK]: () => {
        return { c: 5 };
    },
    [client_1.default.PONG]: (buffer) => {
        const msg = { c: 6 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.num = dataView.getUint32(readIndex, true);
        readIndex += 4;
        return msg;
    },
    [client_1.default.KEY]: (buffer) => {
        const msg = { c: 10 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.seq = dataView.getUint32(readIndex, true);
        readIndex += 4;
        msg.key = dataView.getUint8(readIndex);
        readIndex += 1;
        msg.state = dataView.getUint8(readIndex) !== 0;
        readIndex += 1;
        return msg;
    },
    [client_1.default.COMMAND]: (buffer) => {
        const msg = { c: 11 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        {
            const stringLength = dataView.getUint8(readIndex);
            const encodedString = new Uint8Array(stringLength);
            readIndex += 1;
            for (let charIndex = 0; charIndex < stringLength; charIndex += 1) {
                encodedString[charIndex] = dataView.getUint8(readIndex + charIndex);
            }
            msg.com = utils_1.decodeUTF8(encodedString);
            readIndex += stringLength;
        }
        {
            const stringLength = dataView.getUint8(readIndex);
            const encodedString = new Uint8Array(stringLength);
            readIndex += 1;
            for (let charIndex = 0; charIndex < stringLength; charIndex += 1) {
                encodedString[charIndex] = dataView.getUint8(readIndex + charIndex);
            }
            msg.data = utils_1.decodeUTF8(encodedString);
            readIndex += stringLength;
        }
        return msg;
    },
    [client_1.default.SCOREDETAILED]: () => {
        return { c: 12 };
    },
    [client_1.default.CHAT]: (buffer) => {
        const msg = { c: 20 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        {
            const stringLength = dataView.getUint8(readIndex);
            const encodedString = new Uint8Array(stringLength);
            readIndex += 1;
            for (let charIndex = 0; charIndex < stringLength; charIndex += 1) {
                encodedString[charIndex] = dataView.getUint8(readIndex + charIndex);
            }
            msg.text = utils_1.decodeUTF8(encodedString);
            readIndex += stringLength;
        }
        return msg;
    },
    [client_1.default.WHISPER]: (buffer) => {
        const msg = { c: 21 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.id = dataView.getUint16(readIndex, true);
        readIndex += 2;
        {
            const stringLength = dataView.getUint8(readIndex);
            const encodedString = new Uint8Array(stringLength);
            readIndex += 1;
            for (let charIndex = 0; charIndex < stringLength; charIndex += 1) {
                encodedString[charIndex] = dataView.getUint8(readIndex + charIndex);
            }
            msg.text = utils_1.decodeUTF8(encodedString);
            readIndex += stringLength;
        }
        return msg;
    },
    [client_1.default.SAY]: (buffer) => {
        const msg = { c: 22 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        {
            const stringLength = dataView.getUint8(readIndex);
            const encodedString = new Uint8Array(stringLength);
            readIndex += 1;
            for (let charIndex = 0; charIndex < stringLength; charIndex += 1) {
                encodedString[charIndex] = dataView.getUint8(readIndex + charIndex);
            }
            msg.text = utils_1.decodeUTF8(encodedString);
            readIndex += stringLength;
        }
        return msg;
    },
    [client_1.default.TEAMCHAT]: (buffer) => {
        const msg = { c: 23 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        {
            const stringLength = dataView.getUint8(readIndex);
            const encodedString = new Uint8Array(stringLength);
            readIndex += 1;
            for (let charIndex = 0; charIndex < stringLength; charIndex += 1) {
                encodedString[charIndex] = dataView.getUint8(readIndex + charIndex);
            }
            msg.text = utils_1.decodeUTF8(encodedString);
            readIndex += stringLength;
        }
        return msg;
    },
    [client_1.default.VOTEMUTE]: (buffer) => {
        const msg = { c: 24 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.id = dataView.getUint16(readIndex, true);
        readIndex += 2;
        return msg;
    },
    [client_1.default.LOCALPING]: (buffer) => {
        const msg = { c: 255 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.auth = dataView.getUint32(readIndex, true);
        readIndex += 4;
        return msg;
    }
};
//# sourceMappingURL=client.js.map