/*
 *
 * This file was created automatically with generator
 * Please don't change it manually.
 *
 */

import packet from '../packets/server';
import { encodeUTF8 } from '../support/utils';
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
  [packet.LOGIN]: (msg: Login): ArrayBuffer => {
    // Arrays size calculation
    const arrStrings = [];
    let arrStringsOffset = 0;
    let arraysSize = 0;

    // Array "players" size calculation
    for (let i = 0; i < msg.players.length; i += 1) {
      arraysSize += 17;

      // String "name" size calculation
      arrStrings[arrStringsOffset] = encodeUTF8(msg.players[i].name);
      arraysSize += arrStrings[arrStringsOffset].length;
      arrStringsOffset += 1;
    }

    // Root strings size calculation
    const token = encodeUTF8(msg.token);
    const room = encodeUTF8(msg.room);

    const buffer = new ArrayBuffer(15 + token.length + room.length + arraysSize);
    const dataView = new DataView(buffer);

    let offset = 0;

    arrStringsOffset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // success, boolean
    dataView.setUint8(offset, msg.success === false ? 0 : 1);
    offset += 1;

    // id, uint16
    dataView.setUint16(offset, msg.id, true);
    offset += 2;

    // team, uint16
    dataView.setUint16(offset, msg.team, true);
    offset += 2;

    // clock, uint32
    dataView.setUint32(offset, msg.clock, true);
    offset += 4;

    // token, text
    dataView.setUint8(offset, token.length);
    offset += 1;

    for (let charOffset = 0; charOffset < token.length; charOffset += 1) {
      dataView.setUint8(offset + charOffset, token[charOffset]);
    }

    offset += token.length;

    // type, uint8
    dataView.setUint8(offset, msg.type);
    offset += 1;

    // room, text
    dataView.setUint8(offset, room.length);
    offset += 1;

    for (let charOffset = 0; charOffset < room.length; charOffset += 1) {
      dataView.setUint8(offset + charOffset, room[charOffset]);
    }

    offset += room.length;

    // players, array
    {
      const { players } = msg;

      dataView.setUint16(offset, players.length, true);
      offset += 2;

      for (let i = 0; i < players.length; i += 1) {
        // players[id], uint16
        dataView.setUint16(offset, players[i].id, true);
        offset += 2;

        // players[status], uint8
        dataView.setUint8(offset, players[i].status);
        offset += 1;

        // players[level], uint8
        dataView.setUint8(offset, players[i].level);
        offset += 1;

        // players[name], text
        dataView.setUint8(offset, arrStrings[arrStringsOffset].length);
        offset += 1;

        for (let charOffset = 0; charOffset < arrStrings[arrStringsOffset].length; charOffset += 1) {
          dataView.setUint8(offset + charOffset, arrStrings[arrStringsOffset][charOffset]);
        }
        offset += arrStrings[arrStringsOffset].length;
        arrStringsOffset += 1;

        // players[type], uint8
        dataView.setUint8(offset, players[i].type);
        offset += 1;

        // players[team], uint16
        dataView.setUint16(offset, players[i].team, true);
        offset += 2;

        // players[posX], coordx
        dataView.setUint16(offset, players[i].posX * 2 + 32768, true);
        offset += 2;

        // players[posY], coordy
        dataView.setUint16(offset, players[i].posY * 4 + 32768, true);
        offset += 2;

        // players[rot], rotation
        dataView.setUint16(offset, players[i].rot * 6553.6, true);
        offset += 2;

        // players[flag], uint16
        dataView.setUint16(offset, players[i].flag, true);
        offset += 2;

        // players[upgrades], uint8
        dataView.setUint8(offset, players[i].upgrades);
        offset += 1;

      }
    }

    return buffer;
  },

  [packet.BACKUP]: (msg: Backup): ArrayBuffer => {
    const buffer = new ArrayBuffer(1);
    const dataView = new DataView(buffer);

    dataView.setUint8(0, msg.c);

    return buffer;
  },

  [packet.PING]: (msg: Ping): ArrayBuffer => {
    const buffer = new ArrayBuffer(9);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // clock, uint32
    dataView.setUint32(offset, msg.clock, true);
    offset += 4;

    // num, uint32
    dataView.setUint32(offset, msg.num, true);
    offset += 4;

    return buffer;
  },

  [packet.PING_RESULT]: (msg: PingResult): ArrayBuffer => {
    const buffer = new ArrayBuffer(11);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // ping, uint16
    dataView.setUint16(offset, msg.ping, true);
    offset += 2;

    // playerstotal, uint32
    dataView.setUint32(offset, msg.playerstotal, true);
    offset += 4;

    // playersgame, uint32
    dataView.setUint32(offset, msg.playersgame, true);
    offset += 4;

    return buffer;
  },

  [packet.ACK]: (msg: Ack): ArrayBuffer => {
    const buffer = new ArrayBuffer(1);
    const dataView = new DataView(buffer);

    dataView.setUint8(0, msg.c);

    return buffer;
  },

  [packet.ERROR]: (msg: Error): ArrayBuffer => {
    const buffer = new ArrayBuffer(2);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // error, uint8
    dataView.setUint8(offset, msg.error);
    offset += 1;

    return buffer;
  },

  [packet.COMMAND_REPLY]: (msg: CommandReply): ArrayBuffer => {
    // Root strings size calculation
    const text = encodeUTF8(msg.text);

    const buffer = new ArrayBuffer(4 + text.length);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // type, uint8
    dataView.setUint8(offset, msg.type);
    offset += 1;

    // text, textbig
    dataView.setUint16(offset, text.length, true);
    offset += 2;

    for (let charOffset = 0; charOffset < text.length; charOffset += 1) {
      dataView.setUint8(offset + charOffset, text[charOffset]);
    }


    return buffer;
  },

  [packet.PLAYER_NEW]: (msg: PlayerNew): ArrayBuffer => {
    // Root strings size calculation
    const name = encodeUTF8(msg.name);

    const buffer = new ArrayBuffer(17 + name.length);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // id, uint16
    dataView.setUint16(offset, msg.id, true);
    offset += 2;

    // status, uint8
    dataView.setUint8(offset, msg.status);
    offset += 1;

    // name, text
    dataView.setUint8(offset, name.length);
    offset += 1;

    for (let charOffset = 0; charOffset < name.length; charOffset += 1) {
      dataView.setUint8(offset + charOffset, name[charOffset]);
    }

    offset += name.length;

    // type, uint8
    dataView.setUint8(offset, msg.type);
    offset += 1;

    // team, uint16
    dataView.setUint16(offset, msg.team, true);
    offset += 2;

    // posX, coordx
    dataView.setUint16(offset, msg.posX * 2 + 32768, true);
    offset += 2;

    // posY, coordy
    dataView.setUint16(offset, msg.posY * 4 + 32768, true);
    offset += 2;

    // rot, rotation
    dataView.setUint16(offset, msg.rot * 6553.6, true);
    offset += 2;

    // flag, uint16
    dataView.setUint16(offset, msg.flag, true);
    offset += 2;

    // upgrades, uint8
    dataView.setUint8(offset, msg.upgrades);
    offset += 1;

    return buffer;
  },

  [packet.PLAYER_LEAVE]: (msg: PlayerLeave): ArrayBuffer => {
    const buffer = new ArrayBuffer(3);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // id, uint16
    dataView.setUint16(offset, msg.id, true);
    offset += 2;

    return buffer;
  },

  [packet.PLAYER_UPDATE]: (msg: PlayerUpdate): ArrayBuffer => {
    const buffer = new ArrayBuffer(21);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // clock, uint32
    dataView.setUint32(offset, msg.clock, true);
    offset += 4;

    // id, uint16
    dataView.setUint16(offset, msg.id, true);
    offset += 2;

    // keystate, uint8
    dataView.setUint8(offset, msg.keystate);
    offset += 1;

    // upgrades, uint8
    dataView.setUint8(offset, msg.upgrades);
    offset += 1;

    // posX, coord24
    {
        const value = msg.posX * 512 + 8388608;
        const u8 = value % 256;
        const u16 = (value - u8) / 256;

        dataView.setUint16(offset, u16, true);
        offset += 2;

        dataView.setUint8(offset, u8)
      offset += 1;
    }

    // posY, coord24
    {
        const value = msg.posY * 512 + 8388608;
        const u8 = value % 256;
        const u16 = (value - u8) / 256;

        dataView.setUint16(offset, u16, true);
        offset += 2;

        dataView.setUint8(offset, u8)
      offset += 1;
    }

    // rot, rotation
    dataView.setUint16(offset, msg.rot * 6553.6, true);
    offset += 2;

    // speedX, speed
    dataView.setUint16(offset, msg.speedX * 1638.4 + 32768, true);
    offset += 2;

    // speedY, speed
    dataView.setUint16(offset, msg.speedY * 1638.4 + 32768, true);
    offset += 2;

    return buffer;
  },

  [packet.PLAYER_FIRE]: (msg: PlayerFire): ArrayBuffer => {
    // Arrays size calculation
    let arraysSize = 0;

    // Array "projectiles" size calculation
    for (let i = 0; i < msg.projectiles.length; i += 1) {
      arraysSize += 17;
    }

    const buffer = new ArrayBuffer(11 + arraysSize);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // clock, uint32
    dataView.setUint32(offset, msg.clock, true);
    offset += 4;

    // id, uint16
    dataView.setUint16(offset, msg.id, true);
    offset += 2;

    // energy, healthenergy
    dataView.setUint8(offset, msg.energy * 255);
    offset += 1;

    // energyRegen, regen
    dataView.setUint16(offset, msg.energyRegen * 1e6 + 32768, true);
    offset += 2;

    // projectiles, arraysmall
    {
      const { projectiles } = msg;

      dataView.setUint8(offset, projectiles.length);
      offset += 1;

      for (let i = 0; i < projectiles.length; i += 1) {
        // projectiles[id], uint16
        dataView.setUint16(offset, projectiles[i].id, true);
        offset += 2;

        // projectiles[type], uint8
        dataView.setUint8(offset, projectiles[i].type);
        offset += 1;

        // projectiles[posX], coordx
        dataView.setUint16(offset, projectiles[i].posX * 2 + 32768, true);
        offset += 2;

        // projectiles[posY], coordy
        dataView.setUint16(offset, projectiles[i].posY * 4 + 32768, true);
        offset += 2;

        // projectiles[speedX], speed
        dataView.setUint16(offset, projectiles[i].speedX * 1638.4 + 32768, true);
        offset += 2;

        // projectiles[speedY], speed
        dataView.setUint16(offset, projectiles[i].speedY * 1638.4 + 32768, true);
        offset += 2;

        // projectiles[accelX], accel
        dataView.setUint16(offset, projectiles[i].accelX * 32768 + 32768, true);
        offset += 2;

        // projectiles[accelY], accel
        dataView.setUint16(offset, projectiles[i].accelY * 32768 + 32768, true);
        offset += 2;

        // projectiles[maxSpeed], speed
        dataView.setUint16(offset, projectiles[i].maxSpeed * 1638.4 + 32768, true);
        offset += 2;

      }
    }

    return buffer;
  },

  [packet.PLAYER_HIT]: (msg: PlayerHit): ArrayBuffer => {
    // Arrays size calculation
    let arraysSize = 0;

    // Array "players" size calculation
    for (let i = 0; i < msg.players.length; i += 1) {
      arraysSize += 5;
    }

    const buffer = new ArrayBuffer(11 + arraysSize);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // id, uint16
    dataView.setUint16(offset, msg.id, true);
    offset += 2;

    // type, uint8
    dataView.setUint8(offset, msg.type);
    offset += 1;

    // posX, coordx
    dataView.setUint16(offset, msg.posX * 2 + 32768, true);
    offset += 2;

    // posY, coordy
    dataView.setUint16(offset, msg.posY * 4 + 32768, true);
    offset += 2;

    // owner, uint16
    dataView.setUint16(offset, msg.owner, true);
    offset += 2;

    // players, arraysmall
    {
      const { players } = msg;

      dataView.setUint8(offset, players.length);
      offset += 1;

      for (let i = 0; i < players.length; i += 1) {
        // players[id], uint16
        dataView.setUint16(offset, players[i].id, true);
        offset += 2;

        // players[health], healthenergy
        dataView.setUint8(offset, players[i].health * 255);
        offset += 1;

        // players[healthRegen], regen
        dataView.setUint16(offset, players[i].healthRegen * 1e6 + 32768, true);
        offset += 2;

      }
    }

    return buffer;
  },

  [packet.PLAYER_RESPAWN]: (msg: PlayerRespawn): ArrayBuffer => {
    const buffer = new ArrayBuffer(12);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // id, uint16
    dataView.setUint16(offset, msg.id, true);
    offset += 2;

    // posX, coord24
    {
        const value = msg.posX * 512 + 8388608;
        const u8 = value % 256;
        const u16 = (value - u8) / 256;

        dataView.setUint16(offset, u16, true);
        offset += 2;

        dataView.setUint8(offset, u8)
      offset += 1;
    }

    // posY, coord24
    {
        const value = msg.posY * 512 + 8388608;
        const u8 = value % 256;
        const u16 = (value - u8) / 256;

        dataView.setUint16(offset, u16, true);
        offset += 2;

        dataView.setUint8(offset, u8)
      offset += 1;
    }

    // rot, rotation
    dataView.setUint16(offset, msg.rot * 6553.6, true);
    offset += 2;

    // upgrades, uint8
    dataView.setUint8(offset, msg.upgrades);
    offset += 1;

    return buffer;
  },

  [packet.PLAYER_FLAG]: (msg: PlayerFlag): ArrayBuffer => {
    const buffer = new ArrayBuffer(5);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // id, uint16
    dataView.setUint16(offset, msg.id, true);
    offset += 2;

    // flag, uint16
    dataView.setUint16(offset, msg.flag, true);
    offset += 2;

    return buffer;
  },

  [packet.PLAYER_KILL]: (msg: PlayerKill): ArrayBuffer => {
    const buffer = new ArrayBuffer(9);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // id, uint16
    dataView.setUint16(offset, msg.id, true);
    offset += 2;

    // killer, uint16
    dataView.setUint16(offset, msg.killer, true);
    offset += 2;

    // posX, coordx
    dataView.setUint16(offset, msg.posX * 2 + 32768, true);
    offset += 2;

    // posY, coordy
    dataView.setUint16(offset, msg.posY * 4 + 32768, true);
    offset += 2;

    return buffer;
  },

  [packet.PLAYER_UPGRADE]: (msg: PlayerUpgrade): ArrayBuffer => {
    const buffer = new ArrayBuffer(8);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // upgrades, uint16
    dataView.setUint16(offset, msg.upgrades, true);
    offset += 2;

    // type, uint8
    dataView.setUint8(offset, msg.type);
    offset += 1;

    // speed, uint8
    dataView.setUint8(offset, msg.speed);
    offset += 1;

    // defense, uint8
    dataView.setUint8(offset, msg.defense);
    offset += 1;

    // energy, uint8
    dataView.setUint8(offset, msg.energy);
    offset += 1;

    // missile, uint8
    dataView.setUint8(offset, msg.missile);
    offset += 1;

    return buffer;
  },

  [packet.PLAYER_TYPE]: (msg: PlayerType): ArrayBuffer => {
    const buffer = new ArrayBuffer(4);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // id, uint16
    dataView.setUint16(offset, msg.id, true);
    offset += 2;

    // type, uint8
    dataView.setUint8(offset, msg.type);
    offset += 1;

    return buffer;
  },

  [packet.PLAYER_POWERUP]: (msg: PlayerPowerup): ArrayBuffer => {
    const buffer = new ArrayBuffer(6);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // type, uint8
    dataView.setUint8(offset, msg.type);
    offset += 1;

    // duration, uint32
    dataView.setUint32(offset, msg.duration, true);
    offset += 4;

    return buffer;
  },

  [packet.PLAYER_LEVEL]: (msg: PlayerLevel): ArrayBuffer => {
    const buffer = new ArrayBuffer(5);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // id, uint16
    dataView.setUint16(offset, msg.id, true);
    offset += 2;

    // type, uint8
    dataView.setUint8(offset, msg.type);
    offset += 1;

    // level, uint8
    dataView.setUint8(offset, msg.level);
    offset += 1;

    return buffer;
  },

  [packet.PLAYER_RETEAM]: (msg: PlayerReteam): ArrayBuffer => {
    // Arrays size calculation
    let arraysSize = 0;

    // Array "players" size calculation
    for (let i = 0; i < msg.players.length; i += 1) {
      arraysSize += 4;
    }

    const buffer = new ArrayBuffer(3 + arraysSize);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // players, array
    {
      const { players } = msg;

      dataView.setUint16(offset, players.length, true);
      offset += 2;

      for (let i = 0; i < players.length; i += 1) {
        // players[id], uint16
        dataView.setUint16(offset, players[i].id, true);
        offset += 2;

        // players[team], uint16
        dataView.setUint16(offset, players[i].team, true);
        offset += 2;

      }
    }

    return buffer;
  },

  [packet.GAME_FLAG]: (msg: GameFlag): ArrayBuffer => {
    const buffer = new ArrayBuffer(13);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // type, uint8
    dataView.setUint8(offset, msg.type);
    offset += 1;

    // flag, uint8
    dataView.setUint8(offset, msg.flag);
    offset += 1;

    // id, uint16
    dataView.setUint16(offset, msg.id, true);
    offset += 2;

    // posX, coord24
    {
        const value = msg.posX * 512 + 8388608;
        const u8 = value % 256;
        const u16 = (value - u8) / 256;

        dataView.setUint16(offset, u16, true);
        offset += 2;

        dataView.setUint8(offset, u8)
      offset += 1;
    }

    // posY, coord24
    {
        const value = msg.posY * 512 + 8388608;
        const u8 = value % 256;
        const u16 = (value - u8) / 256;

        dataView.setUint16(offset, u16, true);
        offset += 2;

        dataView.setUint8(offset, u8)
      offset += 1;
    }

    // blueteam, uint8
    dataView.setUint8(offset, msg.blueteam);
    offset += 1;

    // redteam, uint8
    dataView.setUint8(offset, msg.redteam);
    offset += 1;

    return buffer;
  },

  [packet.GAME_SPECTATE]: (msg: GameSpectate): ArrayBuffer => {
    const buffer = new ArrayBuffer(3);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // id, uint16
    dataView.setUint16(offset, msg.id, true);
    offset += 2;

    return buffer;
  },

  [packet.GAME_PLAYERSALIVE]: (msg: GamePlayersalive): ArrayBuffer => {
    const buffer = new ArrayBuffer(3);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // players, uint16
    dataView.setUint16(offset, msg.players, true);
    offset += 2;

    return buffer;
  },

  [packet.GAME_FIREWALL]: (msg: GameFirewall): ArrayBuffer => {
    const buffer = new ArrayBuffer(15);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // type, uint8
    dataView.setUint8(offset, msg.type);
    offset += 1;

    // status, uint8
    dataView.setUint8(offset, msg.status);
    offset += 1;

    // posX, coordx
    dataView.setUint16(offset, msg.posX * 2 + 32768, true);
    offset += 2;

    // posY, coordy
    dataView.setUint16(offset, msg.posY * 4 + 32768, true);
    offset += 2;

    // radius, float32
    dataView.setFloat32(offset, msg.radius, true);
    offset += 4;

    // speed, float32
    dataView.setFloat32(offset, msg.speed, true);
    offset += 4;

    return buffer;
  },

  [packet.EVENT_REPEL]: (msg: EventRepel): ArrayBuffer => {
    // Arrays size calculation
    let arraysSize = 0;

    // Array "players" size calculation
    for (let i = 0; i < msg.players.length; i += 1) {
      arraysSize += 19;
    }

    // Array "mobs" size calculation
    for (let i = 0; i < msg.mobs.length; i += 1) {
      arraysSize += 17;
    }

    const buffer = new ArrayBuffer(22 + arraysSize);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // clock, uint32
    dataView.setUint32(offset, msg.clock, true);
    offset += 4;

    // id, uint16
    dataView.setUint16(offset, msg.id, true);
    offset += 2;

    // posX, coordx
    dataView.setUint16(offset, msg.posX * 2 + 32768, true);
    offset += 2;

    // posY, coordy
    dataView.setUint16(offset, msg.posY * 4 + 32768, true);
    offset += 2;

    // rot, rotation
    dataView.setUint16(offset, msg.rot * 6553.6, true);
    offset += 2;

    // speedX, speed
    dataView.setUint16(offset, msg.speedX * 1638.4 + 32768, true);
    offset += 2;

    // speedY, speed
    dataView.setUint16(offset, msg.speedY * 1638.4 + 32768, true);
    offset += 2;

    // energy, healthenergy
    dataView.setUint8(offset, msg.energy * 255);
    offset += 1;

    // energyRegen, regen
    dataView.setUint16(offset, msg.energyRegen * 1e6 + 32768, true);
    offset += 2;

    // players, arraysmall
    {
      const { players } = msg;

      dataView.setUint8(offset, players.length);
      offset += 1;

      for (let i = 0; i < players.length; i += 1) {
        // players[id], uint16
        dataView.setUint16(offset, players[i].id, true);
        offset += 2;

        // players[keystate], uint8
        dataView.setUint8(offset, players[i].keystate);
        offset += 1;

        // players[posX], coordx
        dataView.setUint16(offset, players[i].posX * 2 + 32768, true);
        offset += 2;

        // players[posY], coordy
        dataView.setUint16(offset, players[i].posY * 4 + 32768, true);
        offset += 2;

        // players[rot], rotation
        dataView.setUint16(offset, players[i].rot * 6553.6, true);
        offset += 2;

        // players[speedX], speed
        dataView.setUint16(offset, players[i].speedX * 1638.4 + 32768, true);
        offset += 2;

        // players[speedY], speed
        dataView.setUint16(offset, players[i].speedY * 1638.4 + 32768, true);
        offset += 2;

        // players[energy], healthenergy
        dataView.setUint8(offset, players[i].energy * 255);
        offset += 1;

        // players[energyRegen], regen
        dataView.setUint16(offset, players[i].energyRegen * 1e6 + 32768, true);
        offset += 2;

        // players[playerHealth], healthenergy
        dataView.setUint8(offset, players[i].playerHealth * 255);
        offset += 1;

        // players[playerHealthRegen], regen
        dataView.setUint16(offset, players[i].playerHealthRegen * 1e6 + 32768, true);
        offset += 2;

      }
    }

    // mobs, arraysmall
    {
      const { mobs } = msg;

      dataView.setUint8(offset, mobs.length);
      offset += 1;

      for (let i = 0; i < mobs.length; i += 1) {
        // mobs[id], uint16
        dataView.setUint16(offset, mobs[i].id, true);
        offset += 2;

        // mobs[type], uint8
        dataView.setUint8(offset, mobs[i].type);
        offset += 1;

        // mobs[posX], coordx
        dataView.setUint16(offset, mobs[i].posX * 2 + 32768, true);
        offset += 2;

        // mobs[posY], coordy
        dataView.setUint16(offset, mobs[i].posY * 4 + 32768, true);
        offset += 2;

        // mobs[speedX], speed
        dataView.setUint16(offset, mobs[i].speedX * 1638.4 + 32768, true);
        offset += 2;

        // mobs[speedY], speed
        dataView.setUint16(offset, mobs[i].speedY * 1638.4 + 32768, true);
        offset += 2;

        // mobs[accelX], accel
        dataView.setUint16(offset, mobs[i].accelX * 32768 + 32768, true);
        offset += 2;

        // mobs[accelY], accel
        dataView.setUint16(offset, mobs[i].accelY * 32768 + 32768, true);
        offset += 2;

        // mobs[maxSpeed], speed
        dataView.setUint16(offset, mobs[i].maxSpeed * 1638.4 + 32768, true);
        offset += 2;

      }
    }

    return buffer;
  },

  [packet.EVENT_BOOST]: (msg: EventBoost): ArrayBuffer => {
    const buffer = new ArrayBuffer(23);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // clock, uint32
    dataView.setUint32(offset, msg.clock, true);
    offset += 4;

    // id, uint16
    dataView.setUint16(offset, msg.id, true);
    offset += 2;

    // boost, boolean
    dataView.setUint8(offset, msg.boost === false ? 0 : 1);
    offset += 1;

    // posX, coord24
    {
        const value = msg.posX * 512 + 8388608;
        const u8 = value % 256;
        const u16 = (value - u8) / 256;

        dataView.setUint16(offset, u16, true);
        offset += 2;

        dataView.setUint8(offset, u8)
      offset += 1;
    }

    // posY, coord24
    {
        const value = msg.posY * 512 + 8388608;
        const u8 = value % 256;
        const u16 = (value - u8) / 256;

        dataView.setUint16(offset, u16, true);
        offset += 2;

        dataView.setUint8(offset, u8)
      offset += 1;
    }

    // rot, rotation
    dataView.setUint16(offset, msg.rot * 6553.6, true);
    offset += 2;

    // speedX, speed
    dataView.setUint16(offset, msg.speedX * 1638.4 + 32768, true);
    offset += 2;

    // speedY, speed
    dataView.setUint16(offset, msg.speedY * 1638.4 + 32768, true);
    offset += 2;

    // energy, healthenergy
    dataView.setUint8(offset, msg.energy * 255);
    offset += 1;

    // energyRegen, regen
    dataView.setUint16(offset, msg.energyRegen * 1e6 + 32768, true);
    offset += 2;

    return buffer;
  },

  [packet.EVENT_BOUNCE]: (msg: EventBounce): ArrayBuffer => {
    const buffer = new ArrayBuffer(20);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // clock, uint32
    dataView.setUint32(offset, msg.clock, true);
    offset += 4;

    // id, uint16
    dataView.setUint16(offset, msg.id, true);
    offset += 2;

    // keystate, uint8
    dataView.setUint8(offset, msg.keystate);
    offset += 1;

    // posX, coord24
    {
        const value = msg.posX * 512 + 8388608;
        const u8 = value % 256;
        const u16 = (value - u8) / 256;

        dataView.setUint16(offset, u16, true);
        offset += 2;

        dataView.setUint8(offset, u8)
      offset += 1;
    }

    // posY, coord24
    {
        const value = msg.posY * 512 + 8388608;
        const u8 = value % 256;
        const u16 = (value - u8) / 256;

        dataView.setUint16(offset, u16, true);
        offset += 2;

        dataView.setUint8(offset, u8)
      offset += 1;
    }

    // rot, rotation
    dataView.setUint16(offset, msg.rot * 6553.6, true);
    offset += 2;

    // speedX, speed
    dataView.setUint16(offset, msg.speedX * 1638.4 + 32768, true);
    offset += 2;

    // speedY, speed
    dataView.setUint16(offset, msg.speedY * 1638.4 + 32768, true);
    offset += 2;

    return buffer;
  },

  [packet.EVENT_STEALTH]: (msg: EventStealth): ArrayBuffer => {
    const buffer = new ArrayBuffer(7);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // id, uint16
    dataView.setUint16(offset, msg.id, true);
    offset += 2;

    // state, boolean
    dataView.setUint8(offset, msg.state === false ? 0 : 1);
    offset += 1;

    // energy, healthenergy
    dataView.setUint8(offset, msg.energy * 255);
    offset += 1;

    // energyRegen, regen
    dataView.setUint16(offset, msg.energyRegen * 1e6 + 32768, true);
    offset += 2;

    return buffer;
  },

  [packet.EVENT_LEAVEHORIZON]: (msg: EventLeavehorizon): ArrayBuffer => {
    const buffer = new ArrayBuffer(4);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // type, uint8
    dataView.setUint8(offset, msg.type);
    offset += 1;

    // id, uint16
    dataView.setUint16(offset, msg.id, true);
    offset += 2;

    return buffer;
  },

  [packet.MOB_UPDATE]: (msg: MobUpdate): ArrayBuffer => {
    const buffer = new ArrayBuffer(22);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // clock, uint32
    dataView.setUint32(offset, msg.clock, true);
    offset += 4;

    // id, uint16
    dataView.setUint16(offset, msg.id, true);
    offset += 2;

    // type, uint8
    dataView.setUint8(offset, msg.type);
    offset += 1;

    // posX, coordx
    dataView.setUint16(offset, msg.posX * 2 + 32768, true);
    offset += 2;

    // posY, coordy
    dataView.setUint16(offset, msg.posY * 4 + 32768, true);
    offset += 2;

    // speedX, speed
    dataView.setUint16(offset, msg.speedX * 1638.4 + 32768, true);
    offset += 2;

    // speedY, speed
    dataView.setUint16(offset, msg.speedY * 1638.4 + 32768, true);
    offset += 2;

    // accelX, accel
    dataView.setUint16(offset, msg.accelX * 32768 + 32768, true);
    offset += 2;

    // accelY, accel
    dataView.setUint16(offset, msg.accelY * 32768 + 32768, true);
    offset += 2;

    // maxSpeed, speed
    dataView.setUint16(offset, msg.maxSpeed * 1638.4 + 32768, true);
    offset += 2;

    return buffer;
  },

  [packet.MOB_UPDATE_STATIONARY]: (msg: MobUpdateStationary): ArrayBuffer => {
    const buffer = new ArrayBuffer(12);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // id, uint16
    dataView.setUint16(offset, msg.id, true);
    offset += 2;

    // type, uint8
    dataView.setUint8(offset, msg.type);
    offset += 1;

    // posX, float32
    dataView.setFloat32(offset, msg.posX, true);
    offset += 4;

    // posY, float32
    dataView.setFloat32(offset, msg.posY, true);
    offset += 4;

    return buffer;
  },

  [packet.MOB_DESPAWN]: (msg: MobDespawn): ArrayBuffer => {
    const buffer = new ArrayBuffer(4);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // id, uint16
    dataView.setUint16(offset, msg.id, true);
    offset += 2;

    // type, uint8
    dataView.setUint8(offset, msg.type);
    offset += 1;

    return buffer;
  },

  [packet.MOB_DESPAWN_COORDS]: (msg: MobDespawnCoords): ArrayBuffer => {
    const buffer = new ArrayBuffer(8);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // id, uint16
    dataView.setUint16(offset, msg.id, true);
    offset += 2;

    // type, uint8
    dataView.setUint8(offset, msg.type);
    offset += 1;

    // posX, coordx
    dataView.setUint16(offset, msg.posX * 2 + 32768, true);
    offset += 2;

    // posY, coordy
    dataView.setUint16(offset, msg.posY * 4 + 32768, true);
    offset += 2;

    return buffer;
  },

  [packet.CHAT_PUBLIC]: (msg: ChatPublic): ArrayBuffer => {
    // Root strings size calculation
    const text = encodeUTF8(msg.text);

    const buffer = new ArrayBuffer(4 + text.length);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // id, uint16
    dataView.setUint16(offset, msg.id, true);
    offset += 2;

    // text, text
    dataView.setUint8(offset, text.length);
    offset += 1;

    for (let charOffset = 0; charOffset < text.length; charOffset += 1) {
      dataView.setUint8(offset + charOffset, text[charOffset]);
    }


    return buffer;
  },

  [packet.CHAT_TEAM]: (msg: ChatTeam): ArrayBuffer => {
    // Root strings size calculation
    const text = encodeUTF8(msg.text);

    const buffer = new ArrayBuffer(4 + text.length);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // id, uint16
    dataView.setUint16(offset, msg.id, true);
    offset += 2;

    // text, text
    dataView.setUint8(offset, text.length);
    offset += 1;

    for (let charOffset = 0; charOffset < text.length; charOffset += 1) {
      dataView.setUint8(offset + charOffset, text[charOffset]);
    }


    return buffer;
  },

  [packet.CHAT_SAY]: (msg: ChatSay): ArrayBuffer => {
    // Root strings size calculation
    const text = encodeUTF8(msg.text);

    const buffer = new ArrayBuffer(4 + text.length);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // id, uint16
    dataView.setUint16(offset, msg.id, true);
    offset += 2;

    // text, text
    dataView.setUint8(offset, text.length);
    offset += 1;

    for (let charOffset = 0; charOffset < text.length; charOffset += 1) {
      dataView.setUint8(offset + charOffset, text[charOffset]);
    }


    return buffer;
  },

  [packet.CHAT_WHISPER]: (msg: ChatWhisper): ArrayBuffer => {
    // Root strings size calculation
    const text = encodeUTF8(msg.text);

    const buffer = new ArrayBuffer(6 + text.length);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // from, uint16
    dataView.setUint16(offset, msg.from, true);
    offset += 2;

    // to, uint16
    dataView.setUint16(offset, msg.to, true);
    offset += 2;

    // text, text
    dataView.setUint8(offset, text.length);
    offset += 1;

    for (let charOffset = 0; charOffset < text.length; charOffset += 1) {
      dataView.setUint8(offset + charOffset, text[charOffset]);
    }


    return buffer;
  },

  [packet.CHAT_VOTEMUTEPASSED]: (msg: ChatVotemutepassed): ArrayBuffer => {
    const buffer = new ArrayBuffer(3);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // id, uint16
    dataView.setUint16(offset, msg.id, true);
    offset += 2;

    return buffer;
  },

  [packet.CHAT_VOTEMUTED]: (msg: ChatVotemuted): ArrayBuffer => {
    const buffer = new ArrayBuffer(1);
    const dataView = new DataView(buffer);

    dataView.setUint8(0, msg.c);

    return buffer;
  },

  [packet.SCORE_UPDATE]: (msg: ScoreUpdate): ArrayBuffer => {
    const buffer = new ArrayBuffer(21);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // id, uint16
    dataView.setUint16(offset, msg.id, true);
    offset += 2;

    // score, uint32
    dataView.setUint32(offset, msg.score, true);
    offset += 4;

    // earnings, uint32
    dataView.setUint32(offset, msg.earnings, true);
    offset += 4;

    // upgrades, uint16
    dataView.setUint16(offset, msg.upgrades, true);
    offset += 2;

    // totalkills, uint32
    dataView.setUint32(offset, msg.totalkills, true);
    offset += 4;

    // totaldeaths, uint32
    dataView.setUint32(offset, msg.totaldeaths, true);
    offset += 4;

    return buffer;
  },

  [packet.SCORE_BOARD]: (msg: ScoreBoard): ArrayBuffer => {
    // Arrays size calculation
    let arraysSize = 0;

    // Array "data" size calculation
    for (let i = 0; i < msg.data.length; i += 1) {
      arraysSize += 7;
    }

    // Array "rankings" size calculation
    for (let i = 0; i < msg.rankings.length; i += 1) {
      arraysSize += 4;
    }

    const buffer = new ArrayBuffer(5 + arraysSize);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // data, array
    {
      const { data } = msg;

      dataView.setUint16(offset, data.length, true);
      offset += 2;

      for (let i = 0; i < data.length; i += 1) {
        // data[id], uint16
        dataView.setUint16(offset, data[i].id, true);
        offset += 2;

        // data[score], uint32
        dataView.setUint32(offset, data[i].score, true);
        offset += 4;

        // data[level], uint8
        dataView.setUint8(offset, data[i].level);
        offset += 1;

      }
    }

    // rankings, array
    {
      const { rankings } = msg;

      dataView.setUint16(offset, rankings.length, true);
      offset += 2;

      for (let i = 0; i < rankings.length; i += 1) {
        // rankings[id], uint16
        dataView.setUint16(offset, rankings[i].id, true);
        offset += 2;

        // rankings[x], uint8
        dataView.setUint8(offset, rankings[i].x);
        offset += 1;

        // rankings[y], uint8
        dataView.setUint8(offset, rankings[i].y);
        offset += 1;

      }
    }

    return buffer;
  },

  [packet.SCORE_DETAILED]: (msg: ScoreDetailed): ArrayBuffer => {
    // Arrays size calculation
    let arraysSize = 0;

    // Array "scores" size calculation
    for (let i = 0; i < msg.scores.length; i += 1) {
      arraysSize += 17;
    }

    const buffer = new ArrayBuffer(3 + arraysSize);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // scores, array
    {
      const { scores } = msg;

      dataView.setUint16(offset, scores.length, true);
      offset += 2;

      for (let i = 0; i < scores.length; i += 1) {
        // scores[id], uint16
        dataView.setUint16(offset, scores[i].id, true);
        offset += 2;

        // scores[level], uint8
        dataView.setUint8(offset, scores[i].level);
        offset += 1;

        // scores[score], uint32
        dataView.setUint32(offset, scores[i].score, true);
        offset += 4;

        // scores[kills], uint16
        dataView.setUint16(offset, scores[i].kills, true);
        offset += 2;

        // scores[deaths], uint16
        dataView.setUint16(offset, scores[i].deaths, true);
        offset += 2;

        // scores[damage], float32
        dataView.setFloat32(offset, scores[i].damage, true);
        offset += 4;

        // scores[ping], uint16
        dataView.setUint16(offset, scores[i].ping, true);
        offset += 2;

      }
    }

    return buffer;
  },

  [packet.SCORE_DETAILED_CTF]: (msg: ScoreDetailedCtf): ArrayBuffer => {
    // Arrays size calculation
    let arraysSize = 0;

    // Array "scores" size calculation
    for (let i = 0; i < msg.scores.length; i += 1) {
      arraysSize += 19;
    }

    const buffer = new ArrayBuffer(3 + arraysSize);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // scores, array
    {
      const { scores } = msg;

      dataView.setUint16(offset, scores.length, true);
      offset += 2;

      for (let i = 0; i < scores.length; i += 1) {
        // scores[id], uint16
        dataView.setUint16(offset, scores[i].id, true);
        offset += 2;

        // scores[level], uint8
        dataView.setUint8(offset, scores[i].level);
        offset += 1;

        // scores[captures], uint16
        dataView.setUint16(offset, scores[i].captures, true);
        offset += 2;

        // scores[score], uint32
        dataView.setUint32(offset, scores[i].score, true);
        offset += 4;

        // scores[kills], uint16
        dataView.setUint16(offset, scores[i].kills, true);
        offset += 2;

        // scores[deaths], uint16
        dataView.setUint16(offset, scores[i].deaths, true);
        offset += 2;

        // scores[damage], float32
        dataView.setFloat32(offset, scores[i].damage, true);
        offset += 4;

        // scores[ping], uint16
        dataView.setUint16(offset, scores[i].ping, true);
        offset += 2;

      }
    }

    return buffer;
  },

  [packet.SCORE_DETAILED_BTR]: (msg: ScoreDetailedBtr): ArrayBuffer => {
    // Arrays size calculation
    let arraysSize = 0;

    // Array "scores" size calculation
    for (let i = 0; i < msg.scores.length; i += 1) {
      arraysSize += 20;
    }

    const buffer = new ArrayBuffer(3 + arraysSize);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // scores, array
    {
      const { scores } = msg;

      dataView.setUint16(offset, scores.length, true);
      offset += 2;

      for (let i = 0; i < scores.length; i += 1) {
        // scores[id], uint16
        dataView.setUint16(offset, scores[i].id, true);
        offset += 2;

        // scores[level], uint8
        dataView.setUint8(offset, scores[i].level);
        offset += 1;

        // scores[alive], boolean
        dataView.setUint8(offset, scores[i].alive === false ? 0 : 1);
        offset += 1;

        // scores[wins], uint16
        dataView.setUint16(offset, scores[i].wins, true);
        offset += 2;

        // scores[score], uint32
        dataView.setUint32(offset, scores[i].score, true);
        offset += 4;

        // scores[kills], uint16
        dataView.setUint16(offset, scores[i].kills, true);
        offset += 2;

        // scores[deaths], uint16
        dataView.setUint16(offset, scores[i].deaths, true);
        offset += 2;

        // scores[damage], float32
        dataView.setFloat32(offset, scores[i].damage, true);
        offset += 4;

        // scores[ping], uint16
        dataView.setUint16(offset, scores[i].ping, true);
        offset += 2;

      }
    }

    return buffer;
  },

  [packet.SERVER_MESSAGE]: (msg: ServerMessage): ArrayBuffer => {
    // Root strings size calculation
    const text = encodeUTF8(msg.text);

    const buffer = new ArrayBuffer(8 + text.length);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // type, uint8
    dataView.setUint8(offset, msg.type);
    offset += 1;

    // duration, uint32
    dataView.setUint32(offset, msg.duration, true);
    offset += 4;

    // text, textbig
    dataView.setUint16(offset, text.length, true);
    offset += 2;

    for (let charOffset = 0; charOffset < text.length; charOffset += 1) {
      dataView.setUint8(offset + charOffset, text[charOffset]);
    }


    return buffer;
  },

  [packet.SERVER_CUSTOM]: (msg: ServerCustom): ArrayBuffer => {
    // Root strings size calculation
    const data = encodeUTF8(msg.data);

    const buffer = new ArrayBuffer(4 + data.length);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // type, uint8
    dataView.setUint8(offset, msg.type);
    offset += 1;

    // data, textbig
    dataView.setUint16(offset, data.length, true);
    offset += 2;

    for (let charOffset = 0; charOffset < data.length; charOffset += 1) {
      dataView.setUint8(offset + charOffset, data[charOffset]);
    }


    return buffer;
  }
};
