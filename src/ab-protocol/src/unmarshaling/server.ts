/*
 *
 * This file was created automatically with generator
 * Please don't change it manually.
 *
 */

import packet from '../packets/server';
import { decodeUTF8 } from '../support/utils';
import {
  Login,
  Backup,
  Ping,
  PingResult,
  Ack,
  Error,
  CommandReply,
  PlayerNew,
  PlayerLeave,
  PlayerUpdate,
  PlayerFire,
  PlayerHit,
  PlayerRespawn,
  PlayerFlag,
  PlayerKill,
  PlayerUpgrade,
  PlayerType,
  PlayerPowerup,
  PlayerLevel,
  PlayerReteam,
  GameFlag,
  GameSpectate,
  GamePlayersalive,
  GameFirewall,
  EventRepel,
  EventBoost,
  EventBounce,
  EventStealth,
  EventLeavehorizon,
  MobUpdate,
  MobUpdateStationary,
  MobDespawn,
  MobDespawnCoords,
  ChatPublic,
  ChatTeam,
  ChatSay,
  ChatWhisper,
  ChatVotemutepassed,
  ChatVotemuted,
  ScoreUpdate,
  ScoreBoard,
  ScoreDetailed,
  ScoreDetailedCtf,
  ScoreDetailedBtr,
  ServerMessage,
  ServerCustom,
} from '../types/packets-server';

export default {
  [packet.LOGIN]: (buffer: ArrayBuffer): Login => {
    const msg: Login = { c: 0 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // success, boolean
    msg.success = dataView.getUint8(readIndex) !== 0;
    readIndex += 1;

    // id, uint16
    msg.id = dataView.getUint16(readIndex, true);
    readIndex += 2;

    // team, uint16
    msg.team = dataView.getUint16(readIndex, true);
    readIndex += 2;

    // clock, uint32
    msg.clock = dataView.getUint32(readIndex, true);
    readIndex += 4;

    // token, text
    {
      const stringLength = dataView.getUint8(readIndex);
      const encodedString = new Uint8Array(stringLength);

      readIndex += 1;

      for (let charIndex = 0; charIndex < stringLength; charIndex += 1) {
        encodedString[charIndex] = dataView.getUint8(readIndex + charIndex);
      }

      msg.token = decodeUTF8(encodedString);
      readIndex += stringLength;
    }

    // type, uint8
    msg.type = dataView.getUint8(readIndex);
    readIndex += 1;

    // room, text
    {
      const stringLength = dataView.getUint8(readIndex);
      const encodedString = new Uint8Array(stringLength);

      readIndex += 1;

      for (let charIndex = 0; charIndex < stringLength; charIndex += 1) {
        encodedString[charIndex] = dataView.getUint8(readIndex + charIndex);
      }

      msg.room = decodeUTF8(encodedString);
      readIndex += stringLength;
    }

    // players, array
    {
      const arrayLength = dataView.getUint16(readIndex, true);

      readIndex += 2;
      msg.players = [];

      for (let i = 0; i < arrayLength; i += 1) {
        const arrayElement: Login['players'][0] = {};

        // id, uint16
        arrayElement.id = dataView.getUint16(readIndex, true);
        readIndex += 2;

        // status, uint8
        arrayElement.status = dataView.getUint8(readIndex);
        readIndex += 1;

        // level, uint8
        arrayElement.level = dataView.getUint8(readIndex);
        readIndex += 1;

        // name, text
        {
          const stringLength = dataView.getUint8(readIndex);
          const encodedString = new Uint8Array(stringLength);

          readIndex += 1;
          for (let charIndex = 0; charIndex < stringLength; charIndex += 1) {
            encodedString[charIndex] = dataView.getUint8(readIndex + charIndex);
          }

          arrayElement.name = decodeUTF8(encodedString);
          readIndex += stringLength;
        }

        // type, uint8
        arrayElement.type = dataView.getUint8(readIndex);
        readIndex += 1;

        // team, uint16
        arrayElement.team = dataView.getUint16(readIndex, true);
        readIndex += 2;

        // posX, coordx
        arrayElement.posX = (dataView.getUint16(readIndex, true) - 32768) / 2;
        readIndex += 2;

        // posY, coordy
        arrayElement.posY = (dataView.getUint16(readIndex, true) - 32768) / 4;
        readIndex += 2;

        // rot, rotation
        arrayElement.rot = dataView.getUint16(readIndex, true) / 6553.6;
        readIndex += 2;

        // flag, uint16
        arrayElement.flag = dataView.getUint16(readIndex, true);
        readIndex += 2;

        // upgrades, uint8
        arrayElement.upgrades = dataView.getUint8(readIndex);
        readIndex += 1;

        msg.players.push(arrayElement)
      }
    }

    return msg;
  },

  [packet.BACKUP]: (): Backup => {
    return { c: 1 };
  },

  [packet.PING]: (buffer: ArrayBuffer): Ping => {
    const msg: Ping = { c: 5 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // clock, uint32
    msg.clock = dataView.getUint32(readIndex, true);
    readIndex += 4;

    // num, uint32
    msg.num = dataView.getUint32(readIndex, true);
    readIndex += 4;

    return msg;
  },

  [packet.PING_RESULT]: (buffer: ArrayBuffer): PingResult => {
    const msg: PingResult = { c: 6 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // ping, uint16
    msg.ping = dataView.getUint16(readIndex, true);
    readIndex += 2;

    // playerstotal, uint32
    msg.playerstotal = dataView.getUint32(readIndex, true);
    readIndex += 4;

    // playersgame, uint32
    msg.playersgame = dataView.getUint32(readIndex, true);
    readIndex += 4;

    return msg;
  },

  [packet.ACK]: (): Ack => {
    return { c: 7 };
  },

  [packet.ERROR]: (buffer: ArrayBuffer): Error => {
    const msg: Error = { c: 8 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // error, uint8
    msg.error = dataView.getUint8(readIndex);
    readIndex += 1;

    return msg;
  },

  [packet.COMMAND_REPLY]: (buffer: ArrayBuffer): CommandReply => {
    const msg: CommandReply = { c: 9 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // type, uint8
    msg.type = dataView.getUint8(readIndex);
    readIndex += 1;

    // text, textbig
    {
      const stringLength = dataView.getUint16(readIndex, true);
      const encodedString = new Uint8Array(stringLength);

      readIndex += 2;

      for (let charIndex = 0; charIndex < stringLength; charIndex += 1) {
        encodedString[charIndex] = dataView.getUint8(readIndex + charIndex);
      }

      msg.text = decodeUTF8(encodedString);
      readIndex += stringLength;
    }

    return msg;
  },

  [packet.PLAYER_NEW]: (buffer: ArrayBuffer): PlayerNew => {
    const msg: PlayerNew = { c: 10 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // id, uint16
    msg.id = dataView.getUint16(readIndex, true);
    readIndex += 2;

    // status, uint8
    msg.status = dataView.getUint8(readIndex);
    readIndex += 1;

    // name, text
    {
      const stringLength = dataView.getUint8(readIndex);
      const encodedString = new Uint8Array(stringLength);

      readIndex += 1;

      for (let charIndex = 0; charIndex < stringLength; charIndex += 1) {
        encodedString[charIndex] = dataView.getUint8(readIndex + charIndex);
      }

      msg.name = decodeUTF8(encodedString);
      readIndex += stringLength;
    }

    // type, uint8
    msg.type = dataView.getUint8(readIndex);
    readIndex += 1;

    // team, uint16
    msg.team = dataView.getUint16(readIndex, true);
    readIndex += 2;

    // posX, coordx
    msg.posX = (dataView.getUint16(readIndex, true) - 32768) / 2;
    readIndex += 2;

    // posY, coordy
    msg.posY = (dataView.getUint16(readIndex, true) - 32768) / 4;
    readIndex += 2;

    // rot, rotation
    msg.rot = dataView.getUint16(readIndex, true) / 6553.6;
    readIndex += 2;

    // flag, uint16
    msg.flag = dataView.getUint16(readIndex, true);
    readIndex += 2;

    // upgrades, uint8
    msg.upgrades = dataView.getUint8(readIndex);
    readIndex += 1;

    return msg;
  },

  [packet.PLAYER_LEAVE]: (buffer: ArrayBuffer): PlayerLeave => {
    const msg: PlayerLeave = { c: 11 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // id, uint16
    msg.id = dataView.getUint16(readIndex, true);
    readIndex += 2;

    return msg;
  },

  [packet.PLAYER_UPDATE]: (buffer: ArrayBuffer): PlayerUpdate => {
    const msg: PlayerUpdate = { c: 12 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // clock, uint32
    msg.clock = dataView.getUint32(readIndex, true);
    readIndex += 4;

    // id, uint16
    msg.id = dataView.getUint16(readIndex, true);
    readIndex += 2;

    // keystate, uint8
    msg.keystate = dataView.getUint8(readIndex);
    readIndex += 1;

    // upgrades, uint8
    msg.upgrades = dataView.getUint8(readIndex);
    readIndex += 1;

    // posX, coord24
    {
      const u16 = 256 * dataView.getUint16(readIndex, true);

      readIndex += 2;
      msg.posX = (u16 + dataView.getUint8(readIndex) - 8388608) / 512;
      readIndex += 1;
    }

    // posY, coord24
    {
      const u16 = 256 * dataView.getUint16(readIndex, true);

      readIndex += 2;
      msg.posY = (u16 + dataView.getUint8(readIndex) - 8388608) / 512;
      readIndex += 1;
    }

    // rot, rotation
    msg.rot = dataView.getUint16(readIndex, true) / 6553.6;
    readIndex += 2;

    // speedX, speed
    msg.speedX = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
    readIndex += 2;

    // speedY, speed
    msg.speedY = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
    readIndex += 2;

    return msg;
  },

  [packet.PLAYER_FIRE]: (buffer: ArrayBuffer): PlayerFire => {
    const msg: PlayerFire = { c: 13 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // clock, uint32
    msg.clock = dataView.getUint32(readIndex, true);
    readIndex += 4;

    // id, uint16
    msg.id = dataView.getUint16(readIndex, true);
    readIndex += 2;

    // energy, healthenergy
    msg.energy = dataView.getUint8(readIndex) / 255;
    readIndex += 1;

    // energyRegen, regen
    msg.energyRegen = (dataView.getUint16(readIndex, true) - 32768) / 1e6;
    readIndex += 2;

    // projectiles, arraysmall
    {
      const arrayLength = dataView.getUint8(readIndex);

      readIndex += 1;
      msg.projectiles = [];

      for (let i = 0; i < arrayLength; i += 1) {
        const arrayElement: PlayerFire['projectiles'][0] = {};

        // id, uint16
        arrayElement.id = dataView.getUint16(readIndex, true);
        readIndex += 2;

        // type, uint8
        arrayElement.type = dataView.getUint8(readIndex);
        readIndex += 1;

        // posX, coordx
        arrayElement.posX = (dataView.getUint16(readIndex, true) - 32768) / 2;
        readIndex += 2;

        // posY, coordy
        arrayElement.posY = (dataView.getUint16(readIndex, true) - 32768) / 4;
        readIndex += 2;

        // speedX, speed
        arrayElement.speedX = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
        readIndex += 2;

        // speedY, speed
        arrayElement.speedY = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
        readIndex += 2;

        // accelX, accel
        arrayElement.accelX = (dataView.getUint16(readIndex, true) - 32768) / 32768;
        readIndex += 2;

        // accelY, accel
        arrayElement.accelY = (dataView.getUint16(readIndex, true) - 32768) / 32768;
        readIndex += 2;

        // maxSpeed, speed
        arrayElement.maxSpeed = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
        readIndex += 2;

        msg.projectiles.push(arrayElement)
      }
    }

    return msg;
  },

  [packet.PLAYER_HIT]: (buffer: ArrayBuffer): PlayerHit => {
    const msg: PlayerHit = { c: 14 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // id, uint16
    msg.id = dataView.getUint16(readIndex, true);
    readIndex += 2;

    // type, uint8
    msg.type = dataView.getUint8(readIndex);
    readIndex += 1;

    // posX, coordx
    msg.posX = (dataView.getUint16(readIndex, true) - 32768) / 2;
    readIndex += 2;

    // posY, coordy
    msg.posY = (dataView.getUint16(readIndex, true) - 32768) / 4;
    readIndex += 2;

    // owner, uint16
    msg.owner = dataView.getUint16(readIndex, true);
    readIndex += 2;

    // players, arraysmall
    {
      const arrayLength = dataView.getUint8(readIndex);

      readIndex += 1;
      msg.players = [];

      for (let i = 0; i < arrayLength; i += 1) {
        const arrayElement: PlayerHit['players'][0] = {};

        // id, uint16
        arrayElement.id = dataView.getUint16(readIndex, true);
        readIndex += 2;

        // health, healthenergy
        arrayElement.health = dataView.getUint8(readIndex) / 255;
        readIndex += 1;

        // healthRegen, regen
        arrayElement.healthRegen = (dataView.getUint16(readIndex, true) - 32768) / 1e6;
        readIndex += 2;

        msg.players.push(arrayElement)
      }
    }

    return msg;
  },

  [packet.PLAYER_RESPAWN]: (buffer: ArrayBuffer): PlayerRespawn => {
    const msg: PlayerRespawn = { c: 15 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // id, uint16
    msg.id = dataView.getUint16(readIndex, true);
    readIndex += 2;

    // posX, coord24
    {
      const u16 = 256 * dataView.getUint16(readIndex, true);

      readIndex += 2;
      msg.posX = (u16 + dataView.getUint8(readIndex) - 8388608) / 512;
      readIndex += 1;
    }

    // posY, coord24
    {
      const u16 = 256 * dataView.getUint16(readIndex, true);

      readIndex += 2;
      msg.posY = (u16 + dataView.getUint8(readIndex) - 8388608) / 512;
      readIndex += 1;
    }

    // rot, rotation
    msg.rot = dataView.getUint16(readIndex, true) / 6553.6;
    readIndex += 2;

    // upgrades, uint8
    msg.upgrades = dataView.getUint8(readIndex);
    readIndex += 1;

    return msg;
  },

  [packet.PLAYER_FLAG]: (buffer: ArrayBuffer): PlayerFlag => {
    const msg: PlayerFlag = { c: 16 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // id, uint16
    msg.id = dataView.getUint16(readIndex, true);
    readIndex += 2;

    // flag, uint16
    msg.flag = dataView.getUint16(readIndex, true);
    readIndex += 2;

    return msg;
  },

  [packet.PLAYER_KILL]: (buffer: ArrayBuffer): PlayerKill => {
    const msg: PlayerKill = { c: 17 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // id, uint16
    msg.id = dataView.getUint16(readIndex, true);
    readIndex += 2;

    // killer, uint16
    msg.killer = dataView.getUint16(readIndex, true);
    readIndex += 2;

    // posX, coordx
    msg.posX = (dataView.getUint16(readIndex, true) - 32768) / 2;
    readIndex += 2;

    // posY, coordy
    msg.posY = (dataView.getUint16(readIndex, true) - 32768) / 4;
    readIndex += 2;

    return msg;
  },

  [packet.PLAYER_UPGRADE]: (buffer: ArrayBuffer): PlayerUpgrade => {
    const msg: PlayerUpgrade = { c: 18 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // upgrades, uint16
    msg.upgrades = dataView.getUint16(readIndex, true);
    readIndex += 2;

    // type, uint8
    msg.type = dataView.getUint8(readIndex);
    readIndex += 1;

    // speed, uint8
    msg.speed = dataView.getUint8(readIndex);
    readIndex += 1;

    // defense, uint8
    msg.defense = dataView.getUint8(readIndex);
    readIndex += 1;

    // energy, uint8
    msg.energy = dataView.getUint8(readIndex);
    readIndex += 1;

    // missile, uint8
    msg.missile = dataView.getUint8(readIndex);
    readIndex += 1;

    return msg;
  },

  [packet.PLAYER_TYPE]: (buffer: ArrayBuffer): PlayerType => {
    const msg: PlayerType = { c: 19 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // id, uint16
    msg.id = dataView.getUint16(readIndex, true);
    readIndex += 2;

    // type, uint8
    msg.type = dataView.getUint8(readIndex);
    readIndex += 1;

    return msg;
  },

  [packet.PLAYER_POWERUP]: (buffer: ArrayBuffer): PlayerPowerup => {
    const msg: PlayerPowerup = { c: 20 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // type, uint8
    msg.type = dataView.getUint8(readIndex);
    readIndex += 1;

    // duration, uint32
    msg.duration = dataView.getUint32(readIndex, true);
    readIndex += 4;

    return msg;
  },

  [packet.PLAYER_LEVEL]: (buffer: ArrayBuffer): PlayerLevel => {
    const msg: PlayerLevel = { c: 21 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // id, uint16
    msg.id = dataView.getUint16(readIndex, true);
    readIndex += 2;

    // type, uint8
    msg.type = dataView.getUint8(readIndex);
    readIndex += 1;

    // level, uint8
    msg.level = dataView.getUint8(readIndex);
    readIndex += 1;

    return msg;
  },

  [packet.PLAYER_RETEAM]: (buffer: ArrayBuffer): PlayerReteam => {
    const msg: PlayerReteam = { c: 22 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // players, array
    {
      const arrayLength = dataView.getUint16(readIndex, true);

      readIndex += 2;
      msg.players = [];

      for (let i = 0; i < arrayLength; i += 1) {
        const arrayElement: PlayerReteam['players'][0] = {};

        // id, uint16
        arrayElement.id = dataView.getUint16(readIndex, true);
        readIndex += 2;

        // team, uint16
        arrayElement.team = dataView.getUint16(readIndex, true);
        readIndex += 2;

        msg.players.push(arrayElement)
      }
    }

    return msg;
  },

  [packet.GAME_FLAG]: (buffer: ArrayBuffer): GameFlag => {
    const msg: GameFlag = { c: 30 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // type, uint8
    msg.type = dataView.getUint8(readIndex);
    readIndex += 1;

    // flag, uint8
    msg.flag = dataView.getUint8(readIndex);
    readIndex += 1;

    // id, uint16
    msg.id = dataView.getUint16(readIndex, true);
    readIndex += 2;

    // posX, coord24
    {
      const u16 = 256 * dataView.getUint16(readIndex, true);

      readIndex += 2;
      msg.posX = (u16 + dataView.getUint8(readIndex) - 8388608) / 512;
      readIndex += 1;
    }

    // posY, coord24
    {
      const u16 = 256 * dataView.getUint16(readIndex, true);

      readIndex += 2;
      msg.posY = (u16 + dataView.getUint8(readIndex) - 8388608) / 512;
      readIndex += 1;
    }

    // blueteam, uint8
    msg.blueteam = dataView.getUint8(readIndex);
    readIndex += 1;

    // redteam, uint8
    msg.redteam = dataView.getUint8(readIndex);
    readIndex += 1;

    return msg;
  },

  [packet.GAME_SPECTATE]: (buffer: ArrayBuffer): GameSpectate => {
    const msg: GameSpectate = { c: 31 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // id, uint16
    msg.id = dataView.getUint16(readIndex, true);
    readIndex += 2;

    return msg;
  },

  [packet.GAME_PLAYERSALIVE]: (buffer: ArrayBuffer): GamePlayersalive => {
    const msg: GamePlayersalive = { c: 32 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // players, uint16
    msg.players = dataView.getUint16(readIndex, true);
    readIndex += 2;

    return msg;
  },

  [packet.GAME_FIREWALL]: (buffer: ArrayBuffer): GameFirewall => {
    const msg: GameFirewall = { c: 33 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // type, uint8
    msg.type = dataView.getUint8(readIndex);
    readIndex += 1;

    // status, uint8
    msg.status = dataView.getUint8(readIndex);
    readIndex += 1;

    // posX, coordx
    msg.posX = (dataView.getUint16(readIndex, true) - 32768) / 2;
    readIndex += 2;

    // posY, coordy
    msg.posY = (dataView.getUint16(readIndex, true) - 32768) / 4;
    readIndex += 2;

    // radius, float32
    msg.radius = dataView.getFloat32(readIndex, true);
    readIndex += 4;

    // speed, float32
    msg.speed = dataView.getFloat32(readIndex, true);
    readIndex += 4;

    return msg;
  },

  [packet.EVENT_REPEL]: (buffer: ArrayBuffer): EventRepel => {
    const msg: EventRepel = { c: 40 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // clock, uint32
    msg.clock = dataView.getUint32(readIndex, true);
    readIndex += 4;

    // id, uint16
    msg.id = dataView.getUint16(readIndex, true);
    readIndex += 2;

    // posX, coordx
    msg.posX = (dataView.getUint16(readIndex, true) - 32768) / 2;
    readIndex += 2;

    // posY, coordy
    msg.posY = (dataView.getUint16(readIndex, true) - 32768) / 4;
    readIndex += 2;

    // rot, rotation
    msg.rot = dataView.getUint16(readIndex, true) / 6553.6;
    readIndex += 2;

    // speedX, speed
    msg.speedX = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
    readIndex += 2;

    // speedY, speed
    msg.speedY = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
    readIndex += 2;

    // energy, healthenergy
    msg.energy = dataView.getUint8(readIndex) / 255;
    readIndex += 1;

    // energyRegen, regen
    msg.energyRegen = (dataView.getUint16(readIndex, true) - 32768) / 1e6;
    readIndex += 2;

    // players, arraysmall
    {
      const arrayLength = dataView.getUint8(readIndex);

      readIndex += 1;
      msg.players = [];

      for (let i = 0; i < arrayLength; i += 1) {
        const arrayElement: EventRepel['players'][0] = {};

        // id, uint16
        arrayElement.id = dataView.getUint16(readIndex, true);
        readIndex += 2;

        // keystate, uint8
        arrayElement.keystate = dataView.getUint8(readIndex);
        readIndex += 1;

        // posX, coordx
        arrayElement.posX = (dataView.getUint16(readIndex, true) - 32768) / 2;
        readIndex += 2;

        // posY, coordy
        arrayElement.posY = (dataView.getUint16(readIndex, true) - 32768) / 4;
        readIndex += 2;

        // rot, rotation
        arrayElement.rot = dataView.getUint16(readIndex, true) / 6553.6;
        readIndex += 2;

        // speedX, speed
        arrayElement.speedX = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
        readIndex += 2;

        // speedY, speed
        arrayElement.speedY = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
        readIndex += 2;

        // energy, healthenergy
        arrayElement.energy = dataView.getUint8(readIndex) / 255;
        readIndex += 1;

        // energyRegen, regen
        arrayElement.energyRegen = (dataView.getUint16(readIndex, true) - 32768) / 1e6;
        readIndex += 2;

        // playerHealth, healthenergy
        arrayElement.playerHealth = dataView.getUint8(readIndex) / 255;
        readIndex += 1;

        // playerHealthRegen, regen
        arrayElement.playerHealthRegen = (dataView.getUint16(readIndex, true) - 32768) / 1e6;
        readIndex += 2;

        msg.players.push(arrayElement)
      }
    }

    // mobs, arraysmall
    {
      const arrayLength = dataView.getUint8(readIndex);

      readIndex += 1;
      msg.mobs = [];

      for (let i = 0; i < arrayLength; i += 1) {
        const arrayElement: EventRepel['mobs'][0] = {};

        // id, uint16
        arrayElement.id = dataView.getUint16(readIndex, true);
        readIndex += 2;

        // type, uint8
        arrayElement.type = dataView.getUint8(readIndex);
        readIndex += 1;

        // posX, coordx
        arrayElement.posX = (dataView.getUint16(readIndex, true) - 32768) / 2;
        readIndex += 2;

        // posY, coordy
        arrayElement.posY = (dataView.getUint16(readIndex, true) - 32768) / 4;
        readIndex += 2;

        // speedX, speed
        arrayElement.speedX = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
        readIndex += 2;

        // speedY, speed
        arrayElement.speedY = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
        readIndex += 2;

        // accelX, accel
        arrayElement.accelX = (dataView.getUint16(readIndex, true) - 32768) / 32768;
        readIndex += 2;

        // accelY, accel
        arrayElement.accelY = (dataView.getUint16(readIndex, true) - 32768) / 32768;
        readIndex += 2;

        // maxSpeed, speed
        arrayElement.maxSpeed = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
        readIndex += 2;

        msg.mobs.push(arrayElement)
      }
    }

    return msg;
  },

  [packet.EVENT_BOOST]: (buffer: ArrayBuffer): EventBoost => {
    const msg: EventBoost = { c: 41 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // clock, uint32
    msg.clock = dataView.getUint32(readIndex, true);
    readIndex += 4;

    // id, uint16
    msg.id = dataView.getUint16(readIndex, true);
    readIndex += 2;

    // boost, boolean
    msg.boost = dataView.getUint8(readIndex) !== 0;
    readIndex += 1;

    // posX, coord24
    {
      const u16 = 256 * dataView.getUint16(readIndex, true);

      readIndex += 2;
      msg.posX = (u16 + dataView.getUint8(readIndex) - 8388608) / 512;
      readIndex += 1;
    }

    // posY, coord24
    {
      const u16 = 256 * dataView.getUint16(readIndex, true);

      readIndex += 2;
      msg.posY = (u16 + dataView.getUint8(readIndex) - 8388608) / 512;
      readIndex += 1;
    }

    // rot, rotation
    msg.rot = dataView.getUint16(readIndex, true) / 6553.6;
    readIndex += 2;

    // speedX, speed
    msg.speedX = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
    readIndex += 2;

    // speedY, speed
    msg.speedY = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
    readIndex += 2;

    // energy, healthenergy
    msg.energy = dataView.getUint8(readIndex) / 255;
    readIndex += 1;

    // energyRegen, regen
    msg.energyRegen = (dataView.getUint16(readIndex, true) - 32768) / 1e6;
    readIndex += 2;

    return msg;
  },

  [packet.EVENT_BOUNCE]: (buffer: ArrayBuffer): EventBounce => {
    const msg: EventBounce = { c: 42 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // clock, uint32
    msg.clock = dataView.getUint32(readIndex, true);
    readIndex += 4;

    // id, uint16
    msg.id = dataView.getUint16(readIndex, true);
    readIndex += 2;

    // keystate, uint8
    msg.keystate = dataView.getUint8(readIndex);
    readIndex += 1;

    // posX, coord24
    {
      const u16 = 256 * dataView.getUint16(readIndex, true);

      readIndex += 2;
      msg.posX = (u16 + dataView.getUint8(readIndex) - 8388608) / 512;
      readIndex += 1;
    }

    // posY, coord24
    {
      const u16 = 256 * dataView.getUint16(readIndex, true);

      readIndex += 2;
      msg.posY = (u16 + dataView.getUint8(readIndex) - 8388608) / 512;
      readIndex += 1;
    }

    // rot, rotation
    msg.rot = dataView.getUint16(readIndex, true) / 6553.6;
    readIndex += 2;

    // speedX, speed
    msg.speedX = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
    readIndex += 2;

    // speedY, speed
    msg.speedY = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
    readIndex += 2;

    return msg;
  },

  [packet.EVENT_STEALTH]: (buffer: ArrayBuffer): EventStealth => {
    const msg: EventStealth = { c: 43 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // id, uint16
    msg.id = dataView.getUint16(readIndex, true);
    readIndex += 2;

    // state, boolean
    msg.state = dataView.getUint8(readIndex) !== 0;
    readIndex += 1;

    // energy, healthenergy
    msg.energy = dataView.getUint8(readIndex) / 255;
    readIndex += 1;

    // energyRegen, regen
    msg.energyRegen = (dataView.getUint16(readIndex, true) - 32768) / 1e6;
    readIndex += 2;

    return msg;
  },

  [packet.EVENT_LEAVEHORIZON]: (buffer: ArrayBuffer): EventLeavehorizon => {
    const msg: EventLeavehorizon = { c: 44 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // type, uint8
    msg.type = dataView.getUint8(readIndex);
    readIndex += 1;

    // id, uint16
    msg.id = dataView.getUint16(readIndex, true);
    readIndex += 2;

    return msg;
  },

  [packet.MOB_UPDATE]: (buffer: ArrayBuffer): MobUpdate => {
    const msg: MobUpdate = { c: 60 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // clock, uint32
    msg.clock = dataView.getUint32(readIndex, true);
    readIndex += 4;

    // id, uint16
    msg.id = dataView.getUint16(readIndex, true);
    readIndex += 2;

    // type, uint8
    msg.type = dataView.getUint8(readIndex);
    readIndex += 1;

    // posX, coordx
    msg.posX = (dataView.getUint16(readIndex, true) - 32768) / 2;
    readIndex += 2;

    // posY, coordy
    msg.posY = (dataView.getUint16(readIndex, true) - 32768) / 4;
    readIndex += 2;

    // speedX, speed
    msg.speedX = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
    readIndex += 2;

    // speedY, speed
    msg.speedY = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
    readIndex += 2;

    // accelX, accel
    msg.accelX = (dataView.getUint16(readIndex, true) - 32768) / 32768;
    readIndex += 2;

    // accelY, accel
    msg.accelY = (dataView.getUint16(readIndex, true) - 32768) / 32768;
    readIndex += 2;

    // maxSpeed, speed
    msg.maxSpeed = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
    readIndex += 2;

    return msg;
  },

  [packet.MOB_UPDATE_STATIONARY]: (buffer: ArrayBuffer): MobUpdateStationary => {
    const msg: MobUpdateStationary = { c: 61 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // id, uint16
    msg.id = dataView.getUint16(readIndex, true);
    readIndex += 2;

    // type, uint8
    msg.type = dataView.getUint8(readIndex);
    readIndex += 1;

    // posX, float32
    msg.posX = dataView.getFloat32(readIndex, true);
    readIndex += 4;

    // posY, float32
    msg.posY = dataView.getFloat32(readIndex, true);
    readIndex += 4;

    return msg;
  },

  [packet.MOB_DESPAWN]: (buffer: ArrayBuffer): MobDespawn => {
    const msg: MobDespawn = { c: 62 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // id, uint16
    msg.id = dataView.getUint16(readIndex, true);
    readIndex += 2;

    // type, uint8
    msg.type = dataView.getUint8(readIndex);
    readIndex += 1;

    return msg;
  },

  [packet.MOB_DESPAWN_COORDS]: (buffer: ArrayBuffer): MobDespawnCoords => {
    const msg: MobDespawnCoords = { c: 63 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // id, uint16
    msg.id = dataView.getUint16(readIndex, true);
    readIndex += 2;

    // type, uint8
    msg.type = dataView.getUint8(readIndex);
    readIndex += 1;

    // posX, coordx
    msg.posX = (dataView.getUint16(readIndex, true) - 32768) / 2;
    readIndex += 2;

    // posY, coordy
    msg.posY = (dataView.getUint16(readIndex, true) - 32768) / 4;
    readIndex += 2;

    return msg;
  },

  [packet.CHAT_PUBLIC]: (buffer: ArrayBuffer): ChatPublic => {
    const msg: ChatPublic = { c: 70 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // id, uint16
    msg.id = dataView.getUint16(readIndex, true);
    readIndex += 2;

    // text, text
    {
      const stringLength = dataView.getUint8(readIndex);
      const encodedString = new Uint8Array(stringLength);

      readIndex += 1;

      for (let charIndex = 0; charIndex < stringLength; charIndex += 1) {
        encodedString[charIndex] = dataView.getUint8(readIndex + charIndex);
      }

      msg.text = decodeUTF8(encodedString);
      readIndex += stringLength;
    }

    return msg;
  },

  [packet.CHAT_TEAM]: (buffer: ArrayBuffer): ChatTeam => {
    const msg: ChatTeam = { c: 71 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // id, uint16
    msg.id = dataView.getUint16(readIndex, true);
    readIndex += 2;

    // text, text
    {
      const stringLength = dataView.getUint8(readIndex);
      const encodedString = new Uint8Array(stringLength);

      readIndex += 1;

      for (let charIndex = 0; charIndex < stringLength; charIndex += 1) {
        encodedString[charIndex] = dataView.getUint8(readIndex + charIndex);
      }

      msg.text = decodeUTF8(encodedString);
      readIndex += stringLength;
    }

    return msg;
  },

  [packet.CHAT_SAY]: (buffer: ArrayBuffer): ChatSay => {
    const msg: ChatSay = { c: 72 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // id, uint16
    msg.id = dataView.getUint16(readIndex, true);
    readIndex += 2;

    // text, text
    {
      const stringLength = dataView.getUint8(readIndex);
      const encodedString = new Uint8Array(stringLength);

      readIndex += 1;

      for (let charIndex = 0; charIndex < stringLength; charIndex += 1) {
        encodedString[charIndex] = dataView.getUint8(readIndex + charIndex);
      }

      msg.text = decodeUTF8(encodedString);
      readIndex += stringLength;
    }

    return msg;
  },

  [packet.CHAT_WHISPER]: (buffer: ArrayBuffer): ChatWhisper => {
    const msg: ChatWhisper = { c: 73 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // from, uint16
    msg.from = dataView.getUint16(readIndex, true);
    readIndex += 2;

    // to, uint16
    msg.to = dataView.getUint16(readIndex, true);
    readIndex += 2;

    // text, text
    {
      const stringLength = dataView.getUint8(readIndex);
      const encodedString = new Uint8Array(stringLength);

      readIndex += 1;

      for (let charIndex = 0; charIndex < stringLength; charIndex += 1) {
        encodedString[charIndex] = dataView.getUint8(readIndex + charIndex);
      }

      msg.text = decodeUTF8(encodedString);
      readIndex += stringLength;
    }

    return msg;
  },

  [packet.CHAT_VOTEMUTEPASSED]: (buffer: ArrayBuffer): ChatVotemutepassed => {
    const msg: ChatVotemutepassed = { c: 78 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // id, uint16
    msg.id = dataView.getUint16(readIndex, true);
    readIndex += 2;

    return msg;
  },

  [packet.CHAT_VOTEMUTED]: (): ChatVotemuted => {
    return { c: 79 };
  },

  [packet.SCORE_UPDATE]: (buffer: ArrayBuffer): ScoreUpdate => {
    const msg: ScoreUpdate = { c: 80 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // id, uint16
    msg.id = dataView.getUint16(readIndex, true);
    readIndex += 2;

    // score, uint32
    msg.score = dataView.getUint32(readIndex, true);
    readIndex += 4;

    // earnings, uint32
    msg.earnings = dataView.getUint32(readIndex, true);
    readIndex += 4;

    // upgrades, uint16
    msg.upgrades = dataView.getUint16(readIndex, true);
    readIndex += 2;

    // totalkills, uint32
    msg.totalkills = dataView.getUint32(readIndex, true);
    readIndex += 4;

    // totaldeaths, uint32
    msg.totaldeaths = dataView.getUint32(readIndex, true);
    readIndex += 4;

    return msg;
  },

  [packet.SCORE_BOARD]: (buffer: ArrayBuffer): ScoreBoard => {
    const msg: ScoreBoard = { c: 81 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // data, array
    {
      const arrayLength = dataView.getUint16(readIndex, true);

      readIndex += 2;
      msg.data = [];

      for (let i = 0; i < arrayLength; i += 1) {
        const arrayElement: ScoreBoard['data'][0] = {};

        // id, uint16
        arrayElement.id = dataView.getUint16(readIndex, true);
        readIndex += 2;

        // score, uint32
        arrayElement.score = dataView.getUint32(readIndex, true);
        readIndex += 4;

        // level, uint8
        arrayElement.level = dataView.getUint8(readIndex);
        readIndex += 1;

        msg.data.push(arrayElement)
      }
    }

    // rankings, array
    {
      const arrayLength = dataView.getUint16(readIndex, true);

      readIndex += 2;
      msg.rankings = [];

      for (let i = 0; i < arrayLength; i += 1) {
        const arrayElement: ScoreBoard['rankings'][0] = {};

        // id, uint16
        arrayElement.id = dataView.getUint16(readIndex, true);
        readIndex += 2;

        // x, uint8
        arrayElement.x = dataView.getUint8(readIndex);
        readIndex += 1;

        // y, uint8
        arrayElement.y = dataView.getUint8(readIndex);
        readIndex += 1;

        msg.rankings.push(arrayElement)
      }
    }

    return msg;
  },

  [packet.SCORE_DETAILED]: (buffer: ArrayBuffer): ScoreDetailed => {
    const msg: ScoreDetailed = { c: 82 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // scores, array
    {
      const arrayLength = dataView.getUint16(readIndex, true);

      readIndex += 2;
      msg.scores = [];

      for (let i = 0; i < arrayLength; i += 1) {
        const arrayElement: ScoreDetailed['scores'][0] = {};

        // id, uint16
        arrayElement.id = dataView.getUint16(readIndex, true);
        readIndex += 2;

        // level, uint8
        arrayElement.level = dataView.getUint8(readIndex);
        readIndex += 1;

        // score, uint32
        arrayElement.score = dataView.getUint32(readIndex, true);
        readIndex += 4;

        // kills, uint16
        arrayElement.kills = dataView.getUint16(readIndex, true);
        readIndex += 2;

        // deaths, uint16
        arrayElement.deaths = dataView.getUint16(readIndex, true);
        readIndex += 2;

        // damage, float32
        arrayElement.damage = dataView.getFloat32(readIndex, true);
        readIndex += 4;

        // ping, uint16
        arrayElement.ping = dataView.getUint16(readIndex, true);
        readIndex += 2;

        msg.scores.push(arrayElement)
      }
    }

    return msg;
  },

  [packet.SCORE_DETAILED_CTF]: (buffer: ArrayBuffer): ScoreDetailedCtf => {
    const msg: ScoreDetailedCtf = { c: 83 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // scores, array
    {
      const arrayLength = dataView.getUint16(readIndex, true);

      readIndex += 2;
      msg.scores = [];

      for (let i = 0; i < arrayLength; i += 1) {
        const arrayElement: ScoreDetailedCtf['scores'][0] = {};

        // id, uint16
        arrayElement.id = dataView.getUint16(readIndex, true);
        readIndex += 2;

        // level, uint8
        arrayElement.level = dataView.getUint8(readIndex);
        readIndex += 1;

        // captures, uint16
        arrayElement.captures = dataView.getUint16(readIndex, true);
        readIndex += 2;

        // score, uint32
        arrayElement.score = dataView.getUint32(readIndex, true);
        readIndex += 4;

        // kills, uint16
        arrayElement.kills = dataView.getUint16(readIndex, true);
        readIndex += 2;

        // deaths, uint16
        arrayElement.deaths = dataView.getUint16(readIndex, true);
        readIndex += 2;

        // damage, float32
        arrayElement.damage = dataView.getFloat32(readIndex, true);
        readIndex += 4;

        // ping, uint16
        arrayElement.ping = dataView.getUint16(readIndex, true);
        readIndex += 2;

        msg.scores.push(arrayElement)
      }
    }

    return msg;
  },

  [packet.SCORE_DETAILED_BTR]: (buffer: ArrayBuffer): ScoreDetailedBtr => {
    const msg: ScoreDetailedBtr = { c: 84 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // scores, array
    {
      const arrayLength = dataView.getUint16(readIndex, true);

      readIndex += 2;
      msg.scores = [];

      for (let i = 0; i < arrayLength; i += 1) {
        const arrayElement: ScoreDetailedBtr['scores'][0] = {};

        // id, uint16
        arrayElement.id = dataView.getUint16(readIndex, true);
        readIndex += 2;

        // level, uint8
        arrayElement.level = dataView.getUint8(readIndex);
        readIndex += 1;

        // alive, boolean
        arrayElement.alive = dataView.getUint8(readIndex) !== 0;
        readIndex += 1;

        // wins, uint16
        arrayElement.wins = dataView.getUint16(readIndex, true);
        readIndex += 2;

        // score, uint32
        arrayElement.score = dataView.getUint32(readIndex, true);
        readIndex += 4;

        // kills, uint16
        arrayElement.kills = dataView.getUint16(readIndex, true);
        readIndex += 2;

        // deaths, uint16
        arrayElement.deaths = dataView.getUint16(readIndex, true);
        readIndex += 2;

        // damage, float32
        arrayElement.damage = dataView.getFloat32(readIndex, true);
        readIndex += 4;

        // ping, uint16
        arrayElement.ping = dataView.getUint16(readIndex, true);
        readIndex += 2;

        msg.scores.push(arrayElement)
      }
    }

    return msg;
  },

  [packet.SERVER_MESSAGE]: (buffer: ArrayBuffer): ServerMessage => {
    const msg: ServerMessage = { c: 90 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // type, uint8
    msg.type = dataView.getUint8(readIndex);
    readIndex += 1;

    // duration, uint32
    msg.duration = dataView.getUint32(readIndex, true);
    readIndex += 4;

    // text, textbig
    {
      const stringLength = dataView.getUint16(readIndex, true);
      const encodedString = new Uint8Array(stringLength);

      readIndex += 2;

      for (let charIndex = 0; charIndex < stringLength; charIndex += 1) {
        encodedString[charIndex] = dataView.getUint8(readIndex + charIndex);
      }

      msg.text = decodeUTF8(encodedString);
      readIndex += stringLength;
    }

    return msg;
  },

  [packet.SERVER_CUSTOM]: (buffer: ArrayBuffer): ServerCustom => {
    const msg: ServerCustom = { c: 91 };
    const dataView = new DataView(buffer);

    let readIndex = 1;

    // type, uint8
    msg.type = dataView.getUint8(readIndex);
    readIndex += 1;

    // data, textbig
    {
      const stringLength = dataView.getUint16(readIndex, true);
      const encodedString = new Uint8Array(stringLength);

      readIndex += 2;

      for (let charIndex = 0; charIndex < stringLength; charIndex += 1) {
        encodedString[charIndex] = dataView.getUint8(readIndex + charIndex);
      }

      msg.data = decodeUTF8(encodedString);
      readIndex += stringLength;
    }

    return msg;
  }
};
