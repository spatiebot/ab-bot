"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../packets/client"));
const utils_1 = require("../support/utils");
exports.default = {
    [client_1.default.LOGIN]: (msg) => {
        const name = utils_1.encodeUTF8(msg.name);
        const session = utils_1.encodeUTF8(msg.session);
        const flag = utils_1.encodeUTF8(msg.flag);
        const buffer = new ArrayBuffer(9 + name.length + session.length + flag.length);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint8(offset, msg.protocol);
        offset += 1;
        dataView.setUint8(offset, name.length);
        offset += 1;
        for (let charOffset = 0; charOffset < name.length; charOffset += 1) {
            dataView.setUint8(offset + charOffset, name[charOffset]);
        }
        offset += name.length;
        dataView.setUint8(offset, session.length);
        offset += 1;
        for (let charOffset = 0; charOffset < session.length; charOffset += 1) {
            dataView.setUint8(offset + charOffset, session[charOffset]);
        }
        offset += session.length;
        dataView.setUint16(offset, msg.horizonX, true);
        offset += 2;
        dataView.setUint16(offset, msg.horizonY, true);
        offset += 2;
        dataView.setUint8(offset, flag.length);
        offset += 1;
        for (let charOffset = 0; charOffset < flag.length; charOffset += 1) {
            dataView.setUint8(offset + charOffset, flag[charOffset]);
        }
        return buffer;
    },
    [client_1.default.BACKUP]: (msg) => {
        const token = utils_1.encodeUTF8(msg.token);
        const buffer = new ArrayBuffer(2 + token.length);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint8(offset, token.length);
        offset += 1;
        for (let charOffset = 0; charOffset < token.length; charOffset += 1) {
            dataView.setUint8(offset + charOffset, token[charOffset]);
        }
        return buffer;
    },
    [client_1.default.HORIZON]: (msg) => {
        const buffer = new ArrayBuffer(5);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint16(offset, msg.horizonX, true);
        offset += 2;
        dataView.setUint16(offset, msg.horizonY, true);
        offset += 2;
        return buffer;
    },
    [client_1.default.ACK]: (msg) => {
        const buffer = new ArrayBuffer(1);
        const dataView = new DataView(buffer);
        dataView.setUint8(0, msg.c);
        return buffer;
    },
    [client_1.default.PONG]: (msg) => {
        const buffer = new ArrayBuffer(5);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint32(offset, msg.num, true);
        offset += 4;
        return buffer;
    },
    [client_1.default.KEY]: (msg) => {
        const buffer = new ArrayBuffer(7);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint32(offset, msg.seq, true);
        offset += 4;
        dataView.setUint8(offset, msg.key);
        offset += 1;
        dataView.setUint8(offset, msg.state === false ? 0 : 1);
        offset += 1;
        return buffer;
    },
    [client_1.default.COMMAND]: (msg) => {
        const com = utils_1.encodeUTF8(msg.com);
        const data = utils_1.encodeUTF8(msg.data);
        const buffer = new ArrayBuffer(3 + com.length + data.length);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint8(offset, com.length);
        offset += 1;
        for (let charOffset = 0; charOffset < com.length; charOffset += 1) {
            dataView.setUint8(offset + charOffset, com[charOffset]);
        }
        offset += com.length;
        dataView.setUint8(offset, data.length);
        offset += 1;
        for (let charOffset = 0; charOffset < data.length; charOffset += 1) {
            dataView.setUint8(offset + charOffset, data[charOffset]);
        }
        return buffer;
    },
    [client_1.default.SCOREDETAILED]: (msg) => {
        const buffer = new ArrayBuffer(1);
        const dataView = new DataView(buffer);
        dataView.setUint8(0, msg.c);
        return buffer;
    },
    [client_1.default.CHAT]: (msg) => {
        const text = utils_1.encodeUTF8(msg.text);
        const buffer = new ArrayBuffer(2 + text.length);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint8(offset, text.length);
        offset += 1;
        for (let charOffset = 0; charOffset < text.length; charOffset += 1) {
            dataView.setUint8(offset + charOffset, text[charOffset]);
        }
        return buffer;
    },
    [client_1.default.WHISPER]: (msg) => {
        const text = utils_1.encodeUTF8(msg.text);
        const buffer = new ArrayBuffer(4 + text.length);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint16(offset, msg.id, true);
        offset += 2;
        dataView.setUint8(offset, text.length);
        offset += 1;
        for (let charOffset = 0; charOffset < text.length; charOffset += 1) {
            dataView.setUint8(offset + charOffset, text[charOffset]);
        }
        return buffer;
    },
    [client_1.default.SAY]: (msg) => {
        const text = utils_1.encodeUTF8(msg.text);
        const buffer = new ArrayBuffer(2 + text.length);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint8(offset, text.length);
        offset += 1;
        for (let charOffset = 0; charOffset < text.length; charOffset += 1) {
            dataView.setUint8(offset + charOffset, text[charOffset]);
        }
        return buffer;
    },
    [client_1.default.TEAMCHAT]: (msg) => {
        const text = utils_1.encodeUTF8(msg.text);
        const buffer = new ArrayBuffer(2 + text.length);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint8(offset, text.length);
        offset += 1;
        for (let charOffset = 0; charOffset < text.length; charOffset += 1) {
            dataView.setUint8(offset + charOffset, text[charOffset]);
        }
        return buffer;
    },
    [client_1.default.VOTEMUTE]: (msg) => {
        const buffer = new ArrayBuffer(3);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint16(offset, msg.id, true);
        offset += 2;
        return buffer;
    },
    [client_1.default.LOCALPING]: (msg) => {
        const buffer = new ArrayBuffer(5);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint32(offset, msg.auth, true);
        offset += 4;
        return buffer;
    }
};
//# sourceMappingURL=client.js.map