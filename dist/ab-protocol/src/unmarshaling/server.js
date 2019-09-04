"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../packets/server"));
const utils_1 = require("../support/utils");
exports.default = {
    [server_1.default.LOGIN]: (buffer) => {
        const msg = { c: 0 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.success = dataView.getUint8(readIndex) !== 0;
        readIndex += 1;
        msg.id = dataView.getUint16(readIndex, true);
        readIndex += 2;
        msg.team = dataView.getUint16(readIndex, true);
        readIndex += 2;
        msg.clock = dataView.getUint32(readIndex, true);
        readIndex += 4;
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
        msg.type = dataView.getUint8(readIndex);
        readIndex += 1;
        {
            const stringLength = dataView.getUint8(readIndex);
            const encodedString = new Uint8Array(stringLength);
            readIndex += 1;
            for (let charIndex = 0; charIndex < stringLength; charIndex += 1) {
                encodedString[charIndex] = dataView.getUint8(readIndex + charIndex);
            }
            msg.room = utils_1.decodeUTF8(encodedString);
            readIndex += stringLength;
        }
        {
            const arrayLength = dataView.getUint16(readIndex, true);
            readIndex += 2;
            msg.players = [];
            for (let i = 0; i < arrayLength; i += 1) {
                const arrayElement = {};
                arrayElement.id = dataView.getUint16(readIndex, true);
                readIndex += 2;
                arrayElement.status = dataView.getUint8(readIndex);
                readIndex += 1;
                arrayElement.level = dataView.getUint8(readIndex);
                readIndex += 1;
                {
                    const stringLength = dataView.getUint8(readIndex);
                    const encodedString = new Uint8Array(stringLength);
                    readIndex += 1;
                    for (let charIndex = 0; charIndex < stringLength; charIndex += 1) {
                        encodedString[charIndex] = dataView.getUint8(readIndex + charIndex);
                    }
                    arrayElement.name = utils_1.decodeUTF8(encodedString);
                    readIndex += stringLength;
                }
                arrayElement.type = dataView.getUint8(readIndex);
                readIndex += 1;
                arrayElement.team = dataView.getUint16(readIndex, true);
                readIndex += 2;
                arrayElement.posX = (dataView.getUint16(readIndex, true) - 32768) / 2;
                readIndex += 2;
                arrayElement.posY = (dataView.getUint16(readIndex, true) - 32768) / 4;
                readIndex += 2;
                arrayElement.rot = dataView.getUint16(readIndex, true) / 6553.6;
                readIndex += 2;
                arrayElement.flag = dataView.getUint16(readIndex, true);
                readIndex += 2;
                arrayElement.upgrades = dataView.getUint8(readIndex);
                readIndex += 1;
                msg.players.push(arrayElement);
            }
        }
        return msg;
    },
    [server_1.default.BACKUP]: () => {
        return { c: 1 };
    },
    [server_1.default.PING]: (buffer) => {
        const msg = { c: 5 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.clock = dataView.getUint32(readIndex, true);
        readIndex += 4;
        msg.num = dataView.getUint32(readIndex, true);
        readIndex += 4;
        return msg;
    },
    [server_1.default.PING_RESULT]: (buffer) => {
        const msg = { c: 6 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.ping = dataView.getUint16(readIndex, true);
        readIndex += 2;
        msg.playerstotal = dataView.getUint32(readIndex, true);
        readIndex += 4;
        msg.playersgame = dataView.getUint32(readIndex, true);
        readIndex += 4;
        return msg;
    },
    [server_1.default.ACK]: () => {
        return { c: 7 };
    },
    [server_1.default.ERROR]: (buffer) => {
        const msg = { c: 8 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.error = dataView.getUint8(readIndex);
        readIndex += 1;
        return msg;
    },
    [server_1.default.COMMAND_REPLY]: (buffer) => {
        const msg = { c: 9 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.type = dataView.getUint8(readIndex);
        readIndex += 1;
        {
            const stringLength = dataView.getUint16(readIndex, true);
            const encodedString = new Uint8Array(stringLength);
            readIndex += 2;
            for (let charIndex = 0; charIndex < stringLength; charIndex += 1) {
                encodedString[charIndex] = dataView.getUint8(readIndex + charIndex);
            }
            msg.text = utils_1.decodeUTF8(encodedString);
            readIndex += stringLength;
        }
        return msg;
    },
    [server_1.default.PLAYER_NEW]: (buffer) => {
        const msg = { c: 10 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.id = dataView.getUint16(readIndex, true);
        readIndex += 2;
        msg.status = dataView.getUint8(readIndex);
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
        msg.type = dataView.getUint8(readIndex);
        readIndex += 1;
        msg.team = dataView.getUint16(readIndex, true);
        readIndex += 2;
        msg.posX = (dataView.getUint16(readIndex, true) - 32768) / 2;
        readIndex += 2;
        msg.posY = (dataView.getUint16(readIndex, true) - 32768) / 4;
        readIndex += 2;
        msg.rot = dataView.getUint16(readIndex, true) / 6553.6;
        readIndex += 2;
        msg.flag = dataView.getUint16(readIndex, true);
        readIndex += 2;
        msg.upgrades = dataView.getUint8(readIndex);
        readIndex += 1;
        return msg;
    },
    [server_1.default.PLAYER_LEAVE]: (buffer) => {
        const msg = { c: 11 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.id = dataView.getUint16(readIndex, true);
        readIndex += 2;
        return msg;
    },
    [server_1.default.PLAYER_UPDATE]: (buffer) => {
        const msg = { c: 12 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.clock = dataView.getUint32(readIndex, true);
        readIndex += 4;
        msg.id = dataView.getUint16(readIndex, true);
        readIndex += 2;
        msg.keystate = dataView.getUint8(readIndex);
        readIndex += 1;
        msg.upgrades = dataView.getUint8(readIndex);
        readIndex += 1;
        {
            const u16 = 256 * dataView.getUint16(readIndex, true);
            readIndex += 2;
            msg.posX = (u16 + dataView.getUint8(readIndex) - 8388608) / 512;
            readIndex += 1;
        }
        {
            const u16 = 256 * dataView.getUint16(readIndex, true);
            readIndex += 2;
            msg.posY = (u16 + dataView.getUint8(readIndex) - 8388608) / 512;
            readIndex += 1;
        }
        msg.rot = dataView.getUint16(readIndex, true) / 6553.6;
        readIndex += 2;
        msg.speedX = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
        readIndex += 2;
        msg.speedY = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
        readIndex += 2;
        return msg;
    },
    [server_1.default.PLAYER_FIRE]: (buffer) => {
        const msg = { c: 13 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.clock = dataView.getUint32(readIndex, true);
        readIndex += 4;
        msg.id = dataView.getUint16(readIndex, true);
        readIndex += 2;
        msg.energy = dataView.getUint8(readIndex) / 255;
        readIndex += 1;
        msg.energyRegen = (dataView.getUint16(readIndex, true) - 32768) / 1e6;
        readIndex += 2;
        {
            const arrayLength = dataView.getUint8(readIndex);
            readIndex += 1;
            msg.projectiles = [];
            for (let i = 0; i < arrayLength; i += 1) {
                const arrayElement = {};
                arrayElement.id = dataView.getUint16(readIndex, true);
                readIndex += 2;
                arrayElement.type = dataView.getUint8(readIndex);
                readIndex += 1;
                arrayElement.posX = (dataView.getUint16(readIndex, true) - 32768) / 2;
                readIndex += 2;
                arrayElement.posY = (dataView.getUint16(readIndex, true) - 32768) / 4;
                readIndex += 2;
                arrayElement.speedX = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
                readIndex += 2;
                arrayElement.speedY = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
                readIndex += 2;
                arrayElement.accelX = (dataView.getUint16(readIndex, true) - 32768) / 32768;
                readIndex += 2;
                arrayElement.accelY = (dataView.getUint16(readIndex, true) - 32768) / 32768;
                readIndex += 2;
                arrayElement.maxSpeed = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
                readIndex += 2;
                msg.projectiles.push(arrayElement);
            }
        }
        return msg;
    },
    [server_1.default.PLAYER_HIT]: (buffer) => {
        const msg = { c: 14 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.id = dataView.getUint16(readIndex, true);
        readIndex += 2;
        msg.type = dataView.getUint8(readIndex);
        readIndex += 1;
        msg.posX = (dataView.getUint16(readIndex, true) - 32768) / 2;
        readIndex += 2;
        msg.posY = (dataView.getUint16(readIndex, true) - 32768) / 4;
        readIndex += 2;
        msg.owner = dataView.getUint16(readIndex, true);
        readIndex += 2;
        {
            const arrayLength = dataView.getUint8(readIndex);
            readIndex += 1;
            msg.players = [];
            for (let i = 0; i < arrayLength; i += 1) {
                const arrayElement = {};
                arrayElement.id = dataView.getUint16(readIndex, true);
                readIndex += 2;
                arrayElement.health = dataView.getUint8(readIndex) / 255;
                readIndex += 1;
                arrayElement.healthRegen = (dataView.getUint16(readIndex, true) - 32768) / 1e6;
                readIndex += 2;
                msg.players.push(arrayElement);
            }
        }
        return msg;
    },
    [server_1.default.PLAYER_RESPAWN]: (buffer) => {
        const msg = { c: 15 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.id = dataView.getUint16(readIndex, true);
        readIndex += 2;
        {
            const u16 = 256 * dataView.getUint16(readIndex, true);
            readIndex += 2;
            msg.posX = (u16 + dataView.getUint8(readIndex) - 8388608) / 512;
            readIndex += 1;
        }
        {
            const u16 = 256 * dataView.getUint16(readIndex, true);
            readIndex += 2;
            msg.posY = (u16 + dataView.getUint8(readIndex) - 8388608) / 512;
            readIndex += 1;
        }
        msg.rot = dataView.getUint16(readIndex, true) / 6553.6;
        readIndex += 2;
        msg.upgrades = dataView.getUint8(readIndex);
        readIndex += 1;
        return msg;
    },
    [server_1.default.PLAYER_FLAG]: (buffer) => {
        const msg = { c: 16 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.id = dataView.getUint16(readIndex, true);
        readIndex += 2;
        msg.flag = dataView.getUint16(readIndex, true);
        readIndex += 2;
        return msg;
    },
    [server_1.default.PLAYER_KILL]: (buffer) => {
        const msg = { c: 17 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.id = dataView.getUint16(readIndex, true);
        readIndex += 2;
        msg.killer = dataView.getUint16(readIndex, true);
        readIndex += 2;
        msg.posX = (dataView.getUint16(readIndex, true) - 32768) / 2;
        readIndex += 2;
        msg.posY = (dataView.getUint16(readIndex, true) - 32768) / 4;
        readIndex += 2;
        return msg;
    },
    [server_1.default.PLAYER_UPGRADE]: (buffer) => {
        const msg = { c: 18 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.upgrades = dataView.getUint16(readIndex, true);
        readIndex += 2;
        msg.type = dataView.getUint8(readIndex);
        readIndex += 1;
        msg.speed = dataView.getUint8(readIndex);
        readIndex += 1;
        msg.defense = dataView.getUint8(readIndex);
        readIndex += 1;
        msg.energy = dataView.getUint8(readIndex);
        readIndex += 1;
        msg.missile = dataView.getUint8(readIndex);
        readIndex += 1;
        return msg;
    },
    [server_1.default.PLAYER_TYPE]: (buffer) => {
        const msg = { c: 19 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.id = dataView.getUint16(readIndex, true);
        readIndex += 2;
        msg.type = dataView.getUint8(readIndex);
        readIndex += 1;
        return msg;
    },
    [server_1.default.PLAYER_POWERUP]: (buffer) => {
        const msg = { c: 20 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.type = dataView.getUint8(readIndex);
        readIndex += 1;
        msg.duration = dataView.getUint32(readIndex, true);
        readIndex += 4;
        return msg;
    },
    [server_1.default.PLAYER_LEVEL]: (buffer) => {
        const msg = { c: 21 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.id = dataView.getUint16(readIndex, true);
        readIndex += 2;
        msg.type = dataView.getUint8(readIndex);
        readIndex += 1;
        msg.level = dataView.getUint8(readIndex);
        readIndex += 1;
        return msg;
    },
    [server_1.default.PLAYER_RETEAM]: (buffer) => {
        const msg = { c: 22 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        {
            const arrayLength = dataView.getUint16(readIndex, true);
            readIndex += 2;
            msg.players = [];
            for (let i = 0; i < arrayLength; i += 1) {
                const arrayElement = {};
                arrayElement.id = dataView.getUint16(readIndex, true);
                readIndex += 2;
                arrayElement.team = dataView.getUint16(readIndex, true);
                readIndex += 2;
                msg.players.push(arrayElement);
            }
        }
        return msg;
    },
    [server_1.default.GAME_FLAG]: (buffer) => {
        const msg = { c: 30 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.type = dataView.getUint8(readIndex);
        readIndex += 1;
        msg.flag = dataView.getUint8(readIndex);
        readIndex += 1;
        msg.id = dataView.getUint16(readIndex, true);
        readIndex += 2;
        {
            const u16 = 256 * dataView.getUint16(readIndex, true);
            readIndex += 2;
            msg.posX = (u16 + dataView.getUint8(readIndex) - 8388608) / 512;
            readIndex += 1;
        }
        {
            const u16 = 256 * dataView.getUint16(readIndex, true);
            readIndex += 2;
            msg.posY = (u16 + dataView.getUint8(readIndex) - 8388608) / 512;
            readIndex += 1;
        }
        msg.blueteam = dataView.getUint8(readIndex);
        readIndex += 1;
        msg.redteam = dataView.getUint8(readIndex);
        readIndex += 1;
        return msg;
    },
    [server_1.default.GAME_SPECTATE]: (buffer) => {
        const msg = { c: 31 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.id = dataView.getUint16(readIndex, true);
        readIndex += 2;
        return msg;
    },
    [server_1.default.GAME_PLAYERSALIVE]: (buffer) => {
        const msg = { c: 32 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.players = dataView.getUint16(readIndex, true);
        readIndex += 2;
        return msg;
    },
    [server_1.default.GAME_FIREWALL]: (buffer) => {
        const msg = { c: 33 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.type = dataView.getUint8(readIndex);
        readIndex += 1;
        msg.status = dataView.getUint8(readIndex);
        readIndex += 1;
        msg.posX = (dataView.getUint16(readIndex, true) - 32768) / 2;
        readIndex += 2;
        msg.posY = (dataView.getUint16(readIndex, true) - 32768) / 4;
        readIndex += 2;
        msg.radius = dataView.getFloat32(readIndex, true);
        readIndex += 4;
        msg.speed = dataView.getFloat32(readIndex, true);
        readIndex += 4;
        return msg;
    },
    [server_1.default.EVENT_REPEL]: (buffer) => {
        const msg = { c: 40 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.clock = dataView.getUint32(readIndex, true);
        readIndex += 4;
        msg.id = dataView.getUint16(readIndex, true);
        readIndex += 2;
        msg.posX = (dataView.getUint16(readIndex, true) - 32768) / 2;
        readIndex += 2;
        msg.posY = (dataView.getUint16(readIndex, true) - 32768) / 4;
        readIndex += 2;
        msg.rot = dataView.getUint16(readIndex, true) / 6553.6;
        readIndex += 2;
        msg.speedX = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
        readIndex += 2;
        msg.speedY = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
        readIndex += 2;
        msg.energy = dataView.getUint8(readIndex) / 255;
        readIndex += 1;
        msg.energyRegen = (dataView.getUint16(readIndex, true) - 32768) / 1e6;
        readIndex += 2;
        {
            const arrayLength = dataView.getUint8(readIndex);
            readIndex += 1;
            msg.players = [];
            for (let i = 0; i < arrayLength; i += 1) {
                const arrayElement = {};
                arrayElement.id = dataView.getUint16(readIndex, true);
                readIndex += 2;
                arrayElement.keystate = dataView.getUint8(readIndex);
                readIndex += 1;
                arrayElement.posX = (dataView.getUint16(readIndex, true) - 32768) / 2;
                readIndex += 2;
                arrayElement.posY = (dataView.getUint16(readIndex, true) - 32768) / 4;
                readIndex += 2;
                arrayElement.rot = dataView.getUint16(readIndex, true) / 6553.6;
                readIndex += 2;
                arrayElement.speedX = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
                readIndex += 2;
                arrayElement.speedY = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
                readIndex += 2;
                arrayElement.energy = dataView.getUint8(readIndex) / 255;
                readIndex += 1;
                arrayElement.energyRegen = (dataView.getUint16(readIndex, true) - 32768) / 1e6;
                readIndex += 2;
                arrayElement.playerHealth = dataView.getUint8(readIndex) / 255;
                readIndex += 1;
                arrayElement.playerHealthRegen = (dataView.getUint16(readIndex, true) - 32768) / 1e6;
                readIndex += 2;
                msg.players.push(arrayElement);
            }
        }
        {
            const arrayLength = dataView.getUint8(readIndex);
            readIndex += 1;
            msg.mobs = [];
            for (let i = 0; i < arrayLength; i += 1) {
                const arrayElement = {};
                arrayElement.id = dataView.getUint16(readIndex, true);
                readIndex += 2;
                arrayElement.type = dataView.getUint8(readIndex);
                readIndex += 1;
                arrayElement.posX = (dataView.getUint16(readIndex, true) - 32768) / 2;
                readIndex += 2;
                arrayElement.posY = (dataView.getUint16(readIndex, true) - 32768) / 4;
                readIndex += 2;
                arrayElement.speedX = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
                readIndex += 2;
                arrayElement.speedY = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
                readIndex += 2;
                arrayElement.accelX = (dataView.getUint16(readIndex, true) - 32768) / 32768;
                readIndex += 2;
                arrayElement.accelY = (dataView.getUint16(readIndex, true) - 32768) / 32768;
                readIndex += 2;
                arrayElement.maxSpeed = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
                readIndex += 2;
                msg.mobs.push(arrayElement);
            }
        }
        return msg;
    },
    [server_1.default.EVENT_BOOST]: (buffer) => {
        const msg = { c: 41 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.clock = dataView.getUint32(readIndex, true);
        readIndex += 4;
        msg.id = dataView.getUint16(readIndex, true);
        readIndex += 2;
        msg.boost = dataView.getUint8(readIndex) !== 0;
        readIndex += 1;
        {
            const u16 = 256 * dataView.getUint16(readIndex, true);
            readIndex += 2;
            msg.posX = (u16 + dataView.getUint8(readIndex) - 8388608) / 512;
            readIndex += 1;
        }
        {
            const u16 = 256 * dataView.getUint16(readIndex, true);
            readIndex += 2;
            msg.posY = (u16 + dataView.getUint8(readIndex) - 8388608) / 512;
            readIndex += 1;
        }
        msg.rot = dataView.getUint16(readIndex, true) / 6553.6;
        readIndex += 2;
        msg.speedX = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
        readIndex += 2;
        msg.speedY = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
        readIndex += 2;
        msg.energy = dataView.getUint8(readIndex) / 255;
        readIndex += 1;
        msg.energyRegen = (dataView.getUint16(readIndex, true) - 32768) / 1e6;
        readIndex += 2;
        return msg;
    },
    [server_1.default.EVENT_BOUNCE]: (buffer) => {
        const msg = { c: 42 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.clock = dataView.getUint32(readIndex, true);
        readIndex += 4;
        msg.id = dataView.getUint16(readIndex, true);
        readIndex += 2;
        msg.keystate = dataView.getUint8(readIndex);
        readIndex += 1;
        {
            const u16 = 256 * dataView.getUint16(readIndex, true);
            readIndex += 2;
            msg.posX = (u16 + dataView.getUint8(readIndex) - 8388608) / 512;
            readIndex += 1;
        }
        {
            const u16 = 256 * dataView.getUint16(readIndex, true);
            readIndex += 2;
            msg.posY = (u16 + dataView.getUint8(readIndex) - 8388608) / 512;
            readIndex += 1;
        }
        msg.rot = dataView.getUint16(readIndex, true) / 6553.6;
        readIndex += 2;
        msg.speedX = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
        readIndex += 2;
        msg.speedY = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
        readIndex += 2;
        return msg;
    },
    [server_1.default.EVENT_STEALTH]: (buffer) => {
        const msg = { c: 43 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.id = dataView.getUint16(readIndex, true);
        readIndex += 2;
        msg.state = dataView.getUint8(readIndex) !== 0;
        readIndex += 1;
        msg.energy = dataView.getUint8(readIndex) / 255;
        readIndex += 1;
        msg.energyRegen = (dataView.getUint16(readIndex, true) - 32768) / 1e6;
        readIndex += 2;
        return msg;
    },
    [server_1.default.EVENT_LEAVEHORIZON]: (buffer) => {
        const msg = { c: 44 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.type = dataView.getUint8(readIndex);
        readIndex += 1;
        msg.id = dataView.getUint16(readIndex, true);
        readIndex += 2;
        return msg;
    },
    [server_1.default.MOB_UPDATE]: (buffer) => {
        const msg = { c: 60 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.clock = dataView.getUint32(readIndex, true);
        readIndex += 4;
        msg.id = dataView.getUint16(readIndex, true);
        readIndex += 2;
        msg.type = dataView.getUint8(readIndex);
        readIndex += 1;
        msg.posX = (dataView.getUint16(readIndex, true) - 32768) / 2;
        readIndex += 2;
        msg.posY = (dataView.getUint16(readIndex, true) - 32768) / 4;
        readIndex += 2;
        msg.speedX = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
        readIndex += 2;
        msg.speedY = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
        readIndex += 2;
        msg.accelX = (dataView.getUint16(readIndex, true) - 32768) / 32768;
        readIndex += 2;
        msg.accelY = (dataView.getUint16(readIndex, true) - 32768) / 32768;
        readIndex += 2;
        msg.maxSpeed = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
        readIndex += 2;
        return msg;
    },
    [server_1.default.MOB_UPDATE_STATIONARY]: (buffer) => {
        const msg = { c: 61 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.id = dataView.getUint16(readIndex, true);
        readIndex += 2;
        msg.type = dataView.getUint8(readIndex);
        readIndex += 1;
        msg.posX = dataView.getFloat32(readIndex, true);
        readIndex += 4;
        msg.posY = dataView.getFloat32(readIndex, true);
        readIndex += 4;
        return msg;
    },
    [server_1.default.MOB_DESPAWN]: (buffer) => {
        const msg = { c: 62 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.id = dataView.getUint16(readIndex, true);
        readIndex += 2;
        msg.type = dataView.getUint8(readIndex);
        readIndex += 1;
        return msg;
    },
    [server_1.default.MOB_DESPAWN_COORDS]: (buffer) => {
        const msg = { c: 63 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.id = dataView.getUint16(readIndex, true);
        readIndex += 2;
        msg.type = dataView.getUint8(readIndex);
        readIndex += 1;
        msg.posX = (dataView.getUint16(readIndex, true) - 32768) / 2;
        readIndex += 2;
        msg.posY = (dataView.getUint16(readIndex, true) - 32768) / 4;
        readIndex += 2;
        return msg;
    },
    [server_1.default.CHAT_PUBLIC]: (buffer) => {
        const msg = { c: 70 };
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
    [server_1.default.CHAT_TEAM]: (buffer) => {
        const msg = { c: 71 };
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
    [server_1.default.CHAT_SAY]: (buffer) => {
        const msg = { c: 72 };
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
    [server_1.default.CHAT_WHISPER]: (buffer) => {
        const msg = { c: 73 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.from = dataView.getUint16(readIndex, true);
        readIndex += 2;
        msg.to = dataView.getUint16(readIndex, true);
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
    [server_1.default.CHAT_VOTEMUTEPASSED]: (buffer) => {
        const msg = { c: 78 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.id = dataView.getUint16(readIndex, true);
        readIndex += 2;
        return msg;
    },
    [server_1.default.CHAT_VOTEMUTED]: () => {
        return { c: 79 };
    },
    [server_1.default.SCORE_UPDATE]: (buffer) => {
        const msg = { c: 80 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.id = dataView.getUint16(readIndex, true);
        readIndex += 2;
        msg.score = dataView.getUint32(readIndex, true);
        readIndex += 4;
        msg.earnings = dataView.getUint32(readIndex, true);
        readIndex += 4;
        msg.upgrades = dataView.getUint16(readIndex, true);
        readIndex += 2;
        msg.totalkills = dataView.getUint32(readIndex, true);
        readIndex += 4;
        msg.totaldeaths = dataView.getUint32(readIndex, true);
        readIndex += 4;
        return msg;
    },
    [server_1.default.SCORE_BOARD]: (buffer) => {
        const msg = { c: 81 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        {
            const arrayLength = dataView.getUint16(readIndex, true);
            readIndex += 2;
            msg.data = [];
            for (let i = 0; i < arrayLength; i += 1) {
                const arrayElement = {};
                arrayElement.id = dataView.getUint16(readIndex, true);
                readIndex += 2;
                arrayElement.score = dataView.getUint32(readIndex, true);
                readIndex += 4;
                arrayElement.level = dataView.getUint8(readIndex);
                readIndex += 1;
                msg.data.push(arrayElement);
            }
        }
        {
            const arrayLength = dataView.getUint16(readIndex, true);
            readIndex += 2;
            msg.rankings = [];
            for (let i = 0; i < arrayLength; i += 1) {
                const arrayElement = {};
                arrayElement.id = dataView.getUint16(readIndex, true);
                readIndex += 2;
                arrayElement.x = dataView.getUint8(readIndex);
                readIndex += 1;
                arrayElement.y = dataView.getUint8(readIndex);
                readIndex += 1;
                msg.rankings.push(arrayElement);
            }
        }
        return msg;
    },
    [server_1.default.SCORE_DETAILED]: (buffer) => {
        const msg = { c: 82 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        {
            const arrayLength = dataView.getUint16(readIndex, true);
            readIndex += 2;
            msg.scores = [];
            for (let i = 0; i < arrayLength; i += 1) {
                const arrayElement = {};
                arrayElement.id = dataView.getUint16(readIndex, true);
                readIndex += 2;
                arrayElement.level = dataView.getUint8(readIndex);
                readIndex += 1;
                arrayElement.score = dataView.getUint32(readIndex, true);
                readIndex += 4;
                arrayElement.kills = dataView.getUint16(readIndex, true);
                readIndex += 2;
                arrayElement.deaths = dataView.getUint16(readIndex, true);
                readIndex += 2;
                arrayElement.damage = dataView.getFloat32(readIndex, true);
                readIndex += 4;
                arrayElement.ping = dataView.getUint16(readIndex, true);
                readIndex += 2;
                msg.scores.push(arrayElement);
            }
        }
        return msg;
    },
    [server_1.default.SCORE_DETAILED_CTF]: (buffer) => {
        const msg = { c: 83 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        {
            const arrayLength = dataView.getUint16(readIndex, true);
            readIndex += 2;
            msg.scores = [];
            for (let i = 0; i < arrayLength; i += 1) {
                const arrayElement = {};
                arrayElement.id = dataView.getUint16(readIndex, true);
                readIndex += 2;
                arrayElement.level = dataView.getUint8(readIndex);
                readIndex += 1;
                arrayElement.captures = dataView.getUint16(readIndex, true);
                readIndex += 2;
                arrayElement.score = dataView.getUint32(readIndex, true);
                readIndex += 4;
                arrayElement.kills = dataView.getUint16(readIndex, true);
                readIndex += 2;
                arrayElement.deaths = dataView.getUint16(readIndex, true);
                readIndex += 2;
                arrayElement.damage = dataView.getFloat32(readIndex, true);
                readIndex += 4;
                arrayElement.ping = dataView.getUint16(readIndex, true);
                readIndex += 2;
                msg.scores.push(arrayElement);
            }
        }
        return msg;
    },
    [server_1.default.SCORE_DETAILED_BTR]: (buffer) => {
        const msg = { c: 84 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        {
            const arrayLength = dataView.getUint16(readIndex, true);
            readIndex += 2;
            msg.scores = [];
            for (let i = 0; i < arrayLength; i += 1) {
                const arrayElement = {};
                arrayElement.id = dataView.getUint16(readIndex, true);
                readIndex += 2;
                arrayElement.level = dataView.getUint8(readIndex);
                readIndex += 1;
                arrayElement.alive = dataView.getUint8(readIndex) !== 0;
                readIndex += 1;
                arrayElement.wins = dataView.getUint16(readIndex, true);
                readIndex += 2;
                arrayElement.score = dataView.getUint32(readIndex, true);
                readIndex += 4;
                arrayElement.kills = dataView.getUint16(readIndex, true);
                readIndex += 2;
                arrayElement.deaths = dataView.getUint16(readIndex, true);
                readIndex += 2;
                arrayElement.damage = dataView.getFloat32(readIndex, true);
                readIndex += 4;
                arrayElement.ping = dataView.getUint16(readIndex, true);
                readIndex += 2;
                msg.scores.push(arrayElement);
            }
        }
        return msg;
    },
    [server_1.default.SERVER_MESSAGE]: (buffer) => {
        const msg = { c: 90 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.type = dataView.getUint8(readIndex);
        readIndex += 1;
        msg.duration = dataView.getUint32(readIndex, true);
        readIndex += 4;
        {
            const stringLength = dataView.getUint16(readIndex, true);
            const encodedString = new Uint8Array(stringLength);
            readIndex += 2;
            for (let charIndex = 0; charIndex < stringLength; charIndex += 1) {
                encodedString[charIndex] = dataView.getUint8(readIndex + charIndex);
            }
            msg.text = utils_1.decodeUTF8(encodedString);
            readIndex += stringLength;
        }
        return msg;
    },
    [server_1.default.SERVER_CUSTOM]: (buffer) => {
        const msg = { c: 91 };
        const dataView = new DataView(buffer);
        let readIndex = 1;
        msg.type = dataView.getUint8(readIndex);
        readIndex += 1;
        {
            const stringLength = dataView.getUint16(readIndex, true);
            const encodedString = new Uint8Array(stringLength);
            readIndex += 2;
            for (let charIndex = 0; charIndex < stringLength; charIndex += 1) {
                encodedString[charIndex] = dataView.getUint8(readIndex + charIndex);
            }
            msg.data = utils_1.decodeUTF8(encodedString);
            readIndex += stringLength;
        }
        return msg;
    }
};
//# sourceMappingURL=server.js.map