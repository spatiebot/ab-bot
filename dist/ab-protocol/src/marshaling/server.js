"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../packets/server"));
const utils_1 = require("../support/utils");
exports.default = {
    [server_1.default.LOGIN]: (msg) => {
        const arrStrings = [];
        let arrStringsOffset = 0;
        let arraysSize = 0;
        for (let i = 0; i < msg.players.length; i += 1) {
            arraysSize += 17;
            arrStrings[arrStringsOffset] = utils_1.encodeUTF8(msg.players[i].name);
            arraysSize += arrStrings[arrStringsOffset].length;
            arrStringsOffset += 1;
        }
        const token = utils_1.encodeUTF8(msg.token);
        const room = utils_1.encodeUTF8(msg.room);
        const buffer = new ArrayBuffer(15 + token.length + room.length + arraysSize);
        const dataView = new DataView(buffer);
        let offset = 0;
        arrStringsOffset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint8(offset, msg.success === false ? 0 : 1);
        offset += 1;
        dataView.setUint16(offset, msg.id, true);
        offset += 2;
        dataView.setUint16(offset, msg.team, true);
        offset += 2;
        dataView.setUint32(offset, msg.clock, true);
        offset += 4;
        dataView.setUint8(offset, token.length);
        offset += 1;
        for (let charOffset = 0; charOffset < token.length; charOffset += 1) {
            dataView.setUint8(offset + charOffset, token[charOffset]);
        }
        offset += token.length;
        dataView.setUint8(offset, msg.type);
        offset += 1;
        dataView.setUint8(offset, room.length);
        offset += 1;
        for (let charOffset = 0; charOffset < room.length; charOffset += 1) {
            dataView.setUint8(offset + charOffset, room[charOffset]);
        }
        offset += room.length;
        {
            const { players } = msg;
            dataView.setUint16(offset, players.length, true);
            offset += 2;
            for (let i = 0; i < players.length; i += 1) {
                dataView.setUint16(offset, players[i].id, true);
                offset += 2;
                dataView.setUint8(offset, players[i].status);
                offset += 1;
                dataView.setUint8(offset, players[i].level);
                offset += 1;
                dataView.setUint8(offset, arrStrings[arrStringsOffset].length);
                offset += 1;
                for (let charOffset = 0; charOffset < arrStrings[arrStringsOffset].length; charOffset += 1) {
                    dataView.setUint8(offset + charOffset, arrStrings[arrStringsOffset][charOffset]);
                }
                offset += arrStrings[arrStringsOffset].length;
                arrStringsOffset += 1;
                dataView.setUint8(offset, players[i].type);
                offset += 1;
                dataView.setUint16(offset, players[i].team, true);
                offset += 2;
                dataView.setUint16(offset, players[i].posX * 2 + 32768, true);
                offset += 2;
                dataView.setUint16(offset, players[i].posY * 4 + 32768, true);
                offset += 2;
                dataView.setUint16(offset, players[i].rot * 6553.6, true);
                offset += 2;
                dataView.setUint16(offset, players[i].flag, true);
                offset += 2;
                dataView.setUint8(offset, players[i].upgrades);
                offset += 1;
            }
        }
        return buffer;
    },
    [server_1.default.BACKUP]: (msg) => {
        const buffer = new ArrayBuffer(1);
        const dataView = new DataView(buffer);
        dataView.setUint8(0, msg.c);
        return buffer;
    },
    [server_1.default.PING]: (msg) => {
        const buffer = new ArrayBuffer(9);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint32(offset, msg.clock, true);
        offset += 4;
        dataView.setUint32(offset, msg.num, true);
        offset += 4;
        return buffer;
    },
    [server_1.default.PING_RESULT]: (msg) => {
        const buffer = new ArrayBuffer(11);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint16(offset, msg.ping, true);
        offset += 2;
        dataView.setUint32(offset, msg.playerstotal, true);
        offset += 4;
        dataView.setUint32(offset, msg.playersgame, true);
        offset += 4;
        return buffer;
    },
    [server_1.default.ACK]: (msg) => {
        const buffer = new ArrayBuffer(1);
        const dataView = new DataView(buffer);
        dataView.setUint8(0, msg.c);
        return buffer;
    },
    [server_1.default.ERROR]: (msg) => {
        const buffer = new ArrayBuffer(2);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint8(offset, msg.error);
        offset += 1;
        return buffer;
    },
    [server_1.default.COMMAND_REPLY]: (msg) => {
        const text = utils_1.encodeUTF8(msg.text);
        const buffer = new ArrayBuffer(4 + text.length);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint8(offset, msg.type);
        offset += 1;
        dataView.setUint16(offset, text.length, true);
        offset += 2;
        for (let charOffset = 0; charOffset < text.length; charOffset += 1) {
            dataView.setUint8(offset + charOffset, text[charOffset]);
        }
        return buffer;
    },
    [server_1.default.PLAYER_NEW]: (msg) => {
        const name = utils_1.encodeUTF8(msg.name);
        const buffer = new ArrayBuffer(17 + name.length);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint16(offset, msg.id, true);
        offset += 2;
        dataView.setUint8(offset, msg.status);
        offset += 1;
        dataView.setUint8(offset, name.length);
        offset += 1;
        for (let charOffset = 0; charOffset < name.length; charOffset += 1) {
            dataView.setUint8(offset + charOffset, name[charOffset]);
        }
        offset += name.length;
        dataView.setUint8(offset, msg.type);
        offset += 1;
        dataView.setUint16(offset, msg.team, true);
        offset += 2;
        dataView.setUint16(offset, msg.posX * 2 + 32768, true);
        offset += 2;
        dataView.setUint16(offset, msg.posY * 4 + 32768, true);
        offset += 2;
        dataView.setUint16(offset, msg.rot * 6553.6, true);
        offset += 2;
        dataView.setUint16(offset, msg.flag, true);
        offset += 2;
        dataView.setUint8(offset, msg.upgrades);
        offset += 1;
        return buffer;
    },
    [server_1.default.PLAYER_LEAVE]: (msg) => {
        const buffer = new ArrayBuffer(3);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint16(offset, msg.id, true);
        offset += 2;
        return buffer;
    },
    [server_1.default.PLAYER_UPDATE]: (msg) => {
        const buffer = new ArrayBuffer(21);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint32(offset, msg.clock, true);
        offset += 4;
        dataView.setUint16(offset, msg.id, true);
        offset += 2;
        dataView.setUint8(offset, msg.keystate);
        offset += 1;
        dataView.setUint8(offset, msg.upgrades);
        offset += 1;
        {
            const value = msg.posX * 512 + 8388608;
            const u8 = value % 256;
            const u16 = (value - u8) / 256;
            dataView.setUint16(offset, u16, true);
            offset += 2;
            dataView.setUint8(offset, u8);
            offset += 1;
        }
        {
            const value = msg.posY * 512 + 8388608;
            const u8 = value % 256;
            const u16 = (value - u8) / 256;
            dataView.setUint16(offset, u16, true);
            offset += 2;
            dataView.setUint8(offset, u8);
            offset += 1;
        }
        dataView.setUint16(offset, msg.rot * 6553.6, true);
        offset += 2;
        dataView.setUint16(offset, msg.speedX * 1638.4 + 32768, true);
        offset += 2;
        dataView.setUint16(offset, msg.speedY * 1638.4 + 32768, true);
        offset += 2;
        return buffer;
    },
    [server_1.default.PLAYER_FIRE]: (msg) => {
        let arraysSize = 0;
        for (let i = 0; i < msg.projectiles.length; i += 1) {
            arraysSize += 17;
        }
        const buffer = new ArrayBuffer(11 + arraysSize);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint32(offset, msg.clock, true);
        offset += 4;
        dataView.setUint16(offset, msg.id, true);
        offset += 2;
        dataView.setUint8(offset, msg.energy * 255);
        offset += 1;
        dataView.setUint16(offset, msg.energyRegen * 1e6 + 32768, true);
        offset += 2;
        {
            const { projectiles } = msg;
            dataView.setUint8(offset, projectiles.length);
            offset += 1;
            for (let i = 0; i < projectiles.length; i += 1) {
                dataView.setUint16(offset, projectiles[i].id, true);
                offset += 2;
                dataView.setUint8(offset, projectiles[i].type);
                offset += 1;
                dataView.setUint16(offset, projectiles[i].posX * 2 + 32768, true);
                offset += 2;
                dataView.setUint16(offset, projectiles[i].posY * 4 + 32768, true);
                offset += 2;
                dataView.setUint16(offset, projectiles[i].speedX * 1638.4 + 32768, true);
                offset += 2;
                dataView.setUint16(offset, projectiles[i].speedY * 1638.4 + 32768, true);
                offset += 2;
                dataView.setUint16(offset, projectiles[i].accelX * 32768 + 32768, true);
                offset += 2;
                dataView.setUint16(offset, projectiles[i].accelY * 32768 + 32768, true);
                offset += 2;
                dataView.setUint16(offset, projectiles[i].maxSpeed * 1638.4 + 32768, true);
                offset += 2;
            }
        }
        return buffer;
    },
    [server_1.default.PLAYER_HIT]: (msg) => {
        let arraysSize = 0;
        for (let i = 0; i < msg.players.length; i += 1) {
            arraysSize += 5;
        }
        const buffer = new ArrayBuffer(11 + arraysSize);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint16(offset, msg.id, true);
        offset += 2;
        dataView.setUint8(offset, msg.type);
        offset += 1;
        dataView.setUint16(offset, msg.posX * 2 + 32768, true);
        offset += 2;
        dataView.setUint16(offset, msg.posY * 4 + 32768, true);
        offset += 2;
        dataView.setUint16(offset, msg.owner, true);
        offset += 2;
        {
            const { players } = msg;
            dataView.setUint8(offset, players.length);
            offset += 1;
            for (let i = 0; i < players.length; i += 1) {
                dataView.setUint16(offset, players[i].id, true);
                offset += 2;
                dataView.setUint8(offset, players[i].health * 255);
                offset += 1;
                dataView.setUint16(offset, players[i].healthRegen * 1e6 + 32768, true);
                offset += 2;
            }
        }
        return buffer;
    },
    [server_1.default.PLAYER_RESPAWN]: (msg) => {
        const buffer = new ArrayBuffer(12);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint16(offset, msg.id, true);
        offset += 2;
        {
            const value = msg.posX * 512 + 8388608;
            const u8 = value % 256;
            const u16 = (value - u8) / 256;
            dataView.setUint16(offset, u16, true);
            offset += 2;
            dataView.setUint8(offset, u8);
            offset += 1;
        }
        {
            const value = msg.posY * 512 + 8388608;
            const u8 = value % 256;
            const u16 = (value - u8) / 256;
            dataView.setUint16(offset, u16, true);
            offset += 2;
            dataView.setUint8(offset, u8);
            offset += 1;
        }
        dataView.setUint16(offset, msg.rot * 6553.6, true);
        offset += 2;
        dataView.setUint8(offset, msg.upgrades);
        offset += 1;
        return buffer;
    },
    [server_1.default.PLAYER_FLAG]: (msg) => {
        const buffer = new ArrayBuffer(5);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint16(offset, msg.id, true);
        offset += 2;
        dataView.setUint16(offset, msg.flag, true);
        offset += 2;
        return buffer;
    },
    [server_1.default.PLAYER_KILL]: (msg) => {
        const buffer = new ArrayBuffer(9);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint16(offset, msg.id, true);
        offset += 2;
        dataView.setUint16(offset, msg.killer, true);
        offset += 2;
        dataView.setUint16(offset, msg.posX * 2 + 32768, true);
        offset += 2;
        dataView.setUint16(offset, msg.posY * 4 + 32768, true);
        offset += 2;
        return buffer;
    },
    [server_1.default.PLAYER_UPGRADE]: (msg) => {
        const buffer = new ArrayBuffer(8);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint16(offset, msg.upgrades, true);
        offset += 2;
        dataView.setUint8(offset, msg.type);
        offset += 1;
        dataView.setUint8(offset, msg.speed);
        offset += 1;
        dataView.setUint8(offset, msg.defense);
        offset += 1;
        dataView.setUint8(offset, msg.energy);
        offset += 1;
        dataView.setUint8(offset, msg.missile);
        offset += 1;
        return buffer;
    },
    [server_1.default.PLAYER_TYPE]: (msg) => {
        const buffer = new ArrayBuffer(4);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint16(offset, msg.id, true);
        offset += 2;
        dataView.setUint8(offset, msg.type);
        offset += 1;
        return buffer;
    },
    [server_1.default.PLAYER_POWERUP]: (msg) => {
        const buffer = new ArrayBuffer(6);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint8(offset, msg.type);
        offset += 1;
        dataView.setUint32(offset, msg.duration, true);
        offset += 4;
        return buffer;
    },
    [server_1.default.PLAYER_LEVEL]: (msg) => {
        const buffer = new ArrayBuffer(5);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint16(offset, msg.id, true);
        offset += 2;
        dataView.setUint8(offset, msg.type);
        offset += 1;
        dataView.setUint8(offset, msg.level);
        offset += 1;
        return buffer;
    },
    [server_1.default.PLAYER_RETEAM]: (msg) => {
        let arraysSize = 0;
        for (let i = 0; i < msg.players.length; i += 1) {
            arraysSize += 4;
        }
        const buffer = new ArrayBuffer(3 + arraysSize);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        {
            const { players } = msg;
            dataView.setUint16(offset, players.length, true);
            offset += 2;
            for (let i = 0; i < players.length; i += 1) {
                dataView.setUint16(offset, players[i].id, true);
                offset += 2;
                dataView.setUint16(offset, players[i].team, true);
                offset += 2;
            }
        }
        return buffer;
    },
    [server_1.default.GAME_FLAG]: (msg) => {
        const buffer = new ArrayBuffer(13);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint8(offset, msg.type);
        offset += 1;
        dataView.setUint8(offset, msg.flag);
        offset += 1;
        dataView.setUint16(offset, msg.id, true);
        offset += 2;
        {
            const value = msg.posX * 512 + 8388608;
            const u8 = value % 256;
            const u16 = (value - u8) / 256;
            dataView.setUint16(offset, u16, true);
            offset += 2;
            dataView.setUint8(offset, u8);
            offset += 1;
        }
        {
            const value = msg.posY * 512 + 8388608;
            const u8 = value % 256;
            const u16 = (value - u8) / 256;
            dataView.setUint16(offset, u16, true);
            offset += 2;
            dataView.setUint8(offset, u8);
            offset += 1;
        }
        dataView.setUint8(offset, msg.blueteam);
        offset += 1;
        dataView.setUint8(offset, msg.redteam);
        offset += 1;
        return buffer;
    },
    [server_1.default.GAME_SPECTATE]: (msg) => {
        const buffer = new ArrayBuffer(3);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint16(offset, msg.id, true);
        offset += 2;
        return buffer;
    },
    [server_1.default.GAME_PLAYERSALIVE]: (msg) => {
        const buffer = new ArrayBuffer(3);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint16(offset, msg.players, true);
        offset += 2;
        return buffer;
    },
    [server_1.default.GAME_FIREWALL]: (msg) => {
        const buffer = new ArrayBuffer(15);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint8(offset, msg.type);
        offset += 1;
        dataView.setUint8(offset, msg.status);
        offset += 1;
        dataView.setUint16(offset, msg.posX * 2 + 32768, true);
        offset += 2;
        dataView.setUint16(offset, msg.posY * 4 + 32768, true);
        offset += 2;
        dataView.setFloat32(offset, msg.radius, true);
        offset += 4;
        dataView.setFloat32(offset, msg.speed, true);
        offset += 4;
        return buffer;
    },
    [server_1.default.EVENT_REPEL]: (msg) => {
        let arraysSize = 0;
        for (let i = 0; i < msg.players.length; i += 1) {
            arraysSize += 19;
        }
        for (let i = 0; i < msg.mobs.length; i += 1) {
            arraysSize += 17;
        }
        const buffer = new ArrayBuffer(22 + arraysSize);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint32(offset, msg.clock, true);
        offset += 4;
        dataView.setUint16(offset, msg.id, true);
        offset += 2;
        dataView.setUint16(offset, msg.posX * 2 + 32768, true);
        offset += 2;
        dataView.setUint16(offset, msg.posY * 4 + 32768, true);
        offset += 2;
        dataView.setUint16(offset, msg.rot * 6553.6, true);
        offset += 2;
        dataView.setUint16(offset, msg.speedX * 1638.4 + 32768, true);
        offset += 2;
        dataView.setUint16(offset, msg.speedY * 1638.4 + 32768, true);
        offset += 2;
        dataView.setUint8(offset, msg.energy * 255);
        offset += 1;
        dataView.setUint16(offset, msg.energyRegen * 1e6 + 32768, true);
        offset += 2;
        {
            const { players } = msg;
            dataView.setUint8(offset, players.length);
            offset += 1;
            for (let i = 0; i < players.length; i += 1) {
                dataView.setUint16(offset, players[i].id, true);
                offset += 2;
                dataView.setUint8(offset, players[i].keystate);
                offset += 1;
                dataView.setUint16(offset, players[i].posX * 2 + 32768, true);
                offset += 2;
                dataView.setUint16(offset, players[i].posY * 4 + 32768, true);
                offset += 2;
                dataView.setUint16(offset, players[i].rot * 6553.6, true);
                offset += 2;
                dataView.setUint16(offset, players[i].speedX * 1638.4 + 32768, true);
                offset += 2;
                dataView.setUint16(offset, players[i].speedY * 1638.4 + 32768, true);
                offset += 2;
                dataView.setUint8(offset, players[i].energy * 255);
                offset += 1;
                dataView.setUint16(offset, players[i].energyRegen * 1e6 + 32768, true);
                offset += 2;
                dataView.setUint8(offset, players[i].playerHealth * 255);
                offset += 1;
                dataView.setUint16(offset, players[i].playerHealthRegen * 1e6 + 32768, true);
                offset += 2;
            }
        }
        {
            const { mobs } = msg;
            dataView.setUint8(offset, mobs.length);
            offset += 1;
            for (let i = 0; i < mobs.length; i += 1) {
                dataView.setUint16(offset, mobs[i].id, true);
                offset += 2;
                dataView.setUint8(offset, mobs[i].type);
                offset += 1;
                dataView.setUint16(offset, mobs[i].posX * 2 + 32768, true);
                offset += 2;
                dataView.setUint16(offset, mobs[i].posY * 4 + 32768, true);
                offset += 2;
                dataView.setUint16(offset, mobs[i].speedX * 1638.4 + 32768, true);
                offset += 2;
                dataView.setUint16(offset, mobs[i].speedY * 1638.4 + 32768, true);
                offset += 2;
                dataView.setUint16(offset, mobs[i].accelX * 32768 + 32768, true);
                offset += 2;
                dataView.setUint16(offset, mobs[i].accelY * 32768 + 32768, true);
                offset += 2;
                dataView.setUint16(offset, mobs[i].maxSpeed * 1638.4 + 32768, true);
                offset += 2;
            }
        }
        return buffer;
    },
    [server_1.default.EVENT_BOOST]: (msg) => {
        const buffer = new ArrayBuffer(23);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint32(offset, msg.clock, true);
        offset += 4;
        dataView.setUint16(offset, msg.id, true);
        offset += 2;
        dataView.setUint8(offset, msg.boost === false ? 0 : 1);
        offset += 1;
        {
            const value = msg.posX * 512 + 8388608;
            const u8 = value % 256;
            const u16 = (value - u8) / 256;
            dataView.setUint16(offset, u16, true);
            offset += 2;
            dataView.setUint8(offset, u8);
            offset += 1;
        }
        {
            const value = msg.posY * 512 + 8388608;
            const u8 = value % 256;
            const u16 = (value - u8) / 256;
            dataView.setUint16(offset, u16, true);
            offset += 2;
            dataView.setUint8(offset, u8);
            offset += 1;
        }
        dataView.setUint16(offset, msg.rot * 6553.6, true);
        offset += 2;
        dataView.setUint16(offset, msg.speedX * 1638.4 + 32768, true);
        offset += 2;
        dataView.setUint16(offset, msg.speedY * 1638.4 + 32768, true);
        offset += 2;
        dataView.setUint8(offset, msg.energy * 255);
        offset += 1;
        dataView.setUint16(offset, msg.energyRegen * 1e6 + 32768, true);
        offset += 2;
        return buffer;
    },
    [server_1.default.EVENT_BOUNCE]: (msg) => {
        const buffer = new ArrayBuffer(20);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint32(offset, msg.clock, true);
        offset += 4;
        dataView.setUint16(offset, msg.id, true);
        offset += 2;
        dataView.setUint8(offset, msg.keystate);
        offset += 1;
        {
            const value = msg.posX * 512 + 8388608;
            const u8 = value % 256;
            const u16 = (value - u8) / 256;
            dataView.setUint16(offset, u16, true);
            offset += 2;
            dataView.setUint8(offset, u8);
            offset += 1;
        }
        {
            const value = msg.posY * 512 + 8388608;
            const u8 = value % 256;
            const u16 = (value - u8) / 256;
            dataView.setUint16(offset, u16, true);
            offset += 2;
            dataView.setUint8(offset, u8);
            offset += 1;
        }
        dataView.setUint16(offset, msg.rot * 6553.6, true);
        offset += 2;
        dataView.setUint16(offset, msg.speedX * 1638.4 + 32768, true);
        offset += 2;
        dataView.setUint16(offset, msg.speedY * 1638.4 + 32768, true);
        offset += 2;
        return buffer;
    },
    [server_1.default.EVENT_STEALTH]: (msg) => {
        const buffer = new ArrayBuffer(7);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint16(offset, msg.id, true);
        offset += 2;
        dataView.setUint8(offset, msg.state === false ? 0 : 1);
        offset += 1;
        dataView.setUint8(offset, msg.energy * 255);
        offset += 1;
        dataView.setUint16(offset, msg.energyRegen * 1e6 + 32768, true);
        offset += 2;
        return buffer;
    },
    [server_1.default.EVENT_LEAVEHORIZON]: (msg) => {
        const buffer = new ArrayBuffer(4);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint8(offset, msg.type);
        offset += 1;
        dataView.setUint16(offset, msg.id, true);
        offset += 2;
        return buffer;
    },
    [server_1.default.MOB_UPDATE]: (msg) => {
        const buffer = new ArrayBuffer(22);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint32(offset, msg.clock, true);
        offset += 4;
        dataView.setUint16(offset, msg.id, true);
        offset += 2;
        dataView.setUint8(offset, msg.type);
        offset += 1;
        dataView.setUint16(offset, msg.posX * 2 + 32768, true);
        offset += 2;
        dataView.setUint16(offset, msg.posY * 4 + 32768, true);
        offset += 2;
        dataView.setUint16(offset, msg.speedX * 1638.4 + 32768, true);
        offset += 2;
        dataView.setUint16(offset, msg.speedY * 1638.4 + 32768, true);
        offset += 2;
        dataView.setUint16(offset, msg.accelX * 32768 + 32768, true);
        offset += 2;
        dataView.setUint16(offset, msg.accelY * 32768 + 32768, true);
        offset += 2;
        dataView.setUint16(offset, msg.maxSpeed * 1638.4 + 32768, true);
        offset += 2;
        return buffer;
    },
    [server_1.default.MOB_UPDATE_STATIONARY]: (msg) => {
        const buffer = new ArrayBuffer(12);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint16(offset, msg.id, true);
        offset += 2;
        dataView.setUint8(offset, msg.type);
        offset += 1;
        dataView.setFloat32(offset, msg.posX, true);
        offset += 4;
        dataView.setFloat32(offset, msg.posY, true);
        offset += 4;
        return buffer;
    },
    [server_1.default.MOB_DESPAWN]: (msg) => {
        const buffer = new ArrayBuffer(4);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint16(offset, msg.id, true);
        offset += 2;
        dataView.setUint8(offset, msg.type);
        offset += 1;
        return buffer;
    },
    [server_1.default.MOB_DESPAWN_COORDS]: (msg) => {
        const buffer = new ArrayBuffer(8);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint16(offset, msg.id, true);
        offset += 2;
        dataView.setUint8(offset, msg.type);
        offset += 1;
        dataView.setUint16(offset, msg.posX * 2 + 32768, true);
        offset += 2;
        dataView.setUint16(offset, msg.posY * 4 + 32768, true);
        offset += 2;
        return buffer;
    },
    [server_1.default.CHAT_PUBLIC]: (msg) => {
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
    [server_1.default.CHAT_TEAM]: (msg) => {
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
    [server_1.default.CHAT_SAY]: (msg) => {
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
    [server_1.default.CHAT_WHISPER]: (msg) => {
        const text = utils_1.encodeUTF8(msg.text);
        const buffer = new ArrayBuffer(6 + text.length);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint16(offset, msg.from, true);
        offset += 2;
        dataView.setUint16(offset, msg.to, true);
        offset += 2;
        dataView.setUint8(offset, text.length);
        offset += 1;
        for (let charOffset = 0; charOffset < text.length; charOffset += 1) {
            dataView.setUint8(offset + charOffset, text[charOffset]);
        }
        return buffer;
    },
    [server_1.default.CHAT_VOTEMUTEPASSED]: (msg) => {
        const buffer = new ArrayBuffer(3);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint16(offset, msg.id, true);
        offset += 2;
        return buffer;
    },
    [server_1.default.CHAT_VOTEMUTED]: (msg) => {
        const buffer = new ArrayBuffer(1);
        const dataView = new DataView(buffer);
        dataView.setUint8(0, msg.c);
        return buffer;
    },
    [server_1.default.SCORE_UPDATE]: (msg) => {
        const buffer = new ArrayBuffer(21);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint16(offset, msg.id, true);
        offset += 2;
        dataView.setUint32(offset, msg.score, true);
        offset += 4;
        dataView.setUint32(offset, msg.earnings, true);
        offset += 4;
        dataView.setUint16(offset, msg.upgrades, true);
        offset += 2;
        dataView.setUint32(offset, msg.totalkills, true);
        offset += 4;
        dataView.setUint32(offset, msg.totaldeaths, true);
        offset += 4;
        return buffer;
    },
    [server_1.default.SCORE_BOARD]: (msg) => {
        let arraysSize = 0;
        for (let i = 0; i < msg.data.length; i += 1) {
            arraysSize += 7;
        }
        for (let i = 0; i < msg.rankings.length; i += 1) {
            arraysSize += 4;
        }
        const buffer = new ArrayBuffer(5 + arraysSize);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        {
            const { data } = msg;
            dataView.setUint16(offset, data.length, true);
            offset += 2;
            for (let i = 0; i < data.length; i += 1) {
                dataView.setUint16(offset, data[i].id, true);
                offset += 2;
                dataView.setUint32(offset, data[i].score, true);
                offset += 4;
                dataView.setUint8(offset, data[i].level);
                offset += 1;
            }
        }
        {
            const { rankings } = msg;
            dataView.setUint16(offset, rankings.length, true);
            offset += 2;
            for (let i = 0; i < rankings.length; i += 1) {
                dataView.setUint16(offset, rankings[i].id, true);
                offset += 2;
                dataView.setUint8(offset, rankings[i].x);
                offset += 1;
                dataView.setUint8(offset, rankings[i].y);
                offset += 1;
            }
        }
        return buffer;
    },
    [server_1.default.SCORE_DETAILED]: (msg) => {
        let arraysSize = 0;
        for (let i = 0; i < msg.scores.length; i += 1) {
            arraysSize += 17;
        }
        const buffer = new ArrayBuffer(3 + arraysSize);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        {
            const { scores } = msg;
            dataView.setUint16(offset, scores.length, true);
            offset += 2;
            for (let i = 0; i < scores.length; i += 1) {
                dataView.setUint16(offset, scores[i].id, true);
                offset += 2;
                dataView.setUint8(offset, scores[i].level);
                offset += 1;
                dataView.setUint32(offset, scores[i].score, true);
                offset += 4;
                dataView.setUint16(offset, scores[i].kills, true);
                offset += 2;
                dataView.setUint16(offset, scores[i].deaths, true);
                offset += 2;
                dataView.setFloat32(offset, scores[i].damage, true);
                offset += 4;
                dataView.setUint16(offset, scores[i].ping, true);
                offset += 2;
            }
        }
        return buffer;
    },
    [server_1.default.SCORE_DETAILED_CTF]: (msg) => {
        let arraysSize = 0;
        for (let i = 0; i < msg.scores.length; i += 1) {
            arraysSize += 19;
        }
        const buffer = new ArrayBuffer(3 + arraysSize);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        {
            const { scores } = msg;
            dataView.setUint16(offset, scores.length, true);
            offset += 2;
            for (let i = 0; i < scores.length; i += 1) {
                dataView.setUint16(offset, scores[i].id, true);
                offset += 2;
                dataView.setUint8(offset, scores[i].level);
                offset += 1;
                dataView.setUint16(offset, scores[i].captures, true);
                offset += 2;
                dataView.setUint32(offset, scores[i].score, true);
                offset += 4;
                dataView.setUint16(offset, scores[i].kills, true);
                offset += 2;
                dataView.setUint16(offset, scores[i].deaths, true);
                offset += 2;
                dataView.setFloat32(offset, scores[i].damage, true);
                offset += 4;
                dataView.setUint16(offset, scores[i].ping, true);
                offset += 2;
            }
        }
        return buffer;
    },
    [server_1.default.SCORE_DETAILED_BTR]: (msg) => {
        let arraysSize = 0;
        for (let i = 0; i < msg.scores.length; i += 1) {
            arraysSize += 20;
        }
        const buffer = new ArrayBuffer(3 + arraysSize);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        {
            const { scores } = msg;
            dataView.setUint16(offset, scores.length, true);
            offset += 2;
            for (let i = 0; i < scores.length; i += 1) {
                dataView.setUint16(offset, scores[i].id, true);
                offset += 2;
                dataView.setUint8(offset, scores[i].level);
                offset += 1;
                dataView.setUint8(offset, scores[i].alive === false ? 0 : 1);
                offset += 1;
                dataView.setUint16(offset, scores[i].wins, true);
                offset += 2;
                dataView.setUint32(offset, scores[i].score, true);
                offset += 4;
                dataView.setUint16(offset, scores[i].kills, true);
                offset += 2;
                dataView.setUint16(offset, scores[i].deaths, true);
                offset += 2;
                dataView.setFloat32(offset, scores[i].damage, true);
                offset += 4;
                dataView.setUint16(offset, scores[i].ping, true);
                offset += 2;
            }
        }
        return buffer;
    },
    [server_1.default.SERVER_MESSAGE]: (msg) => {
        const text = utils_1.encodeUTF8(msg.text);
        const buffer = new ArrayBuffer(8 + text.length);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint8(offset, msg.type);
        offset += 1;
        dataView.setUint32(offset, msg.duration, true);
        offset += 4;
        dataView.setUint16(offset, text.length, true);
        offset += 2;
        for (let charOffset = 0; charOffset < text.length; charOffset += 1) {
            dataView.setUint8(offset + charOffset, text[charOffset]);
        }
        return buffer;
    },
    [server_1.default.SERVER_CUSTOM]: (msg) => {
        const data = utils_1.encodeUTF8(msg.data);
        const buffer = new ArrayBuffer(4 + data.length);
        const dataView = new DataView(buffer);
        let offset = 0;
        dataView.setUint8(offset, msg.c);
        offset += 1;
        dataView.setUint8(offset, msg.type);
        offset += 1;
        dataView.setUint16(offset, data.length, true);
        offset += 2;
        for (let charOffset = 0; charOffset < data.length; charOffset += 1) {
            dataView.setUint8(offset + charOffset, data[charOffset]);
        }
        return buffer;
    }
};
//# sourceMappingURL=server.js.map