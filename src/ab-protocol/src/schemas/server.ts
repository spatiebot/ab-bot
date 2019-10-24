/* eslint-disable @typescript-eslint/no-empty-interface */
import SERVER_PACKETS from '../packets/server';
import { DATA_TYPES } from '../types/data';

export default {
  [SERVER_PACKETS.LOGIN]: [
    ['success', DATA_TYPES.boolean],
    ['id', DATA_TYPES.uint16],
    ['team', DATA_TYPES.uint16],
    ['clock', DATA_TYPES.uint32],
    ['token', DATA_TYPES.text],
    ['type', DATA_TYPES.uint8],
    ['room', DATA_TYPES.text],
    [
      'players',
      DATA_TYPES.array,
      [
        ['id', DATA_TYPES.uint16],
        ['status', DATA_TYPES.uint8],
        ['level', DATA_TYPES.uint8],
        ['name', DATA_TYPES.text],
        ['type', DATA_TYPES.uint8],
        ['team', DATA_TYPES.uint16],
        ['posX', DATA_TYPES.coordx],
        ['posY', DATA_TYPES.coordy],
        ['rot', DATA_TYPES.rotation],
        ['flag', DATA_TYPES.uint16],
        ['upgrades', DATA_TYPES.uint8],
      ],
    ],
  ],

  [SERVER_PACKETS.BACKUP]: [],

  [SERVER_PACKETS.PING]: [['clock', DATA_TYPES.uint32], ['num', DATA_TYPES.uint32]],

  [SERVER_PACKETS.PING_RESULT]: [
    ['ping', DATA_TYPES.uint16],
    ['playerstotal', DATA_TYPES.uint32],
    ['playersgame', DATA_TYPES.uint32],
  ],

  [SERVER_PACKETS.ACK]: [],

  [SERVER_PACKETS.ERROR]: [['error', DATA_TYPES.uint8]],

  [SERVER_PACKETS.COMMAND_REPLY]: [['type', DATA_TYPES.uint8], ['text', DATA_TYPES.textbig]],

  [SERVER_PACKETS.PLAYER_NEW]: [
    ['id', DATA_TYPES.uint16],
    ['status', DATA_TYPES.uint8],
    ['name', DATA_TYPES.text],
    ['type', DATA_TYPES.uint8],
    ['team', DATA_TYPES.uint16],
    ['posX', DATA_TYPES.coordx],
    ['posY', DATA_TYPES.coordy],
    ['rot', DATA_TYPES.rotation],
    ['flag', DATA_TYPES.uint16],
    ['upgrades', DATA_TYPES.uint8],
  ],

  [SERVER_PACKETS.PLAYER_LEAVE]: [['id', DATA_TYPES.uint16]],

  [SERVER_PACKETS.PLAYER_UPDATE]: [
    ['clock', DATA_TYPES.uint32],
    ['id', DATA_TYPES.uint16],
    ['keystate', DATA_TYPES.uint8],
    ['upgrades', DATA_TYPES.uint8],
    ['posX', DATA_TYPES.coord24],
    ['posY', DATA_TYPES.coord24],
    ['rot', DATA_TYPES.rotation],
    ['speedX', DATA_TYPES.speed],
    ['speedY', DATA_TYPES.speed],
  ],

  [SERVER_PACKETS.PLAYER_FIRE]: [
    ['clock', DATA_TYPES.uint32],
    ['id', DATA_TYPES.uint16],
    ['energy', DATA_TYPES.healthenergy],
    ['energyRegen', DATA_TYPES.regen],
    [
      'projectiles',
      DATA_TYPES.arraysmall,
      [
        ['id', DATA_TYPES.uint16],
        ['type', DATA_TYPES.uint8],
        ['posX', DATA_TYPES.coordx],
        ['posY', DATA_TYPES.coordy],
        ['speedX', DATA_TYPES.speed],
        ['speedY', DATA_TYPES.speed],
        ['accelX', DATA_TYPES.accel],
        ['accelY', DATA_TYPES.accel],
        ['maxSpeed', DATA_TYPES.speed],
      ],
    ],
  ],

  // [packet.PLAYER_SAY]: [['id', types.uint16], ['text', types.text]],

  [SERVER_PACKETS.PLAYER_RESPAWN]: [
    ['id', DATA_TYPES.uint16],
    ['posX', DATA_TYPES.coord24],
    ['posY', DATA_TYPES.coord24],
    ['rot', DATA_TYPES.rotation],
    ['upgrades', DATA_TYPES.uint8],
  ],

  [SERVER_PACKETS.PLAYER_FLAG]: [['id', DATA_TYPES.uint16], ['flag', DATA_TYPES.uint16]],

  [SERVER_PACKETS.PLAYER_HIT]: [
    ['id', DATA_TYPES.uint16],
    ['type', DATA_TYPES.uint8],
    ['posX', DATA_TYPES.coordx],
    ['posY', DATA_TYPES.coordy],
    ['owner', DATA_TYPES.uint16],
    [
      'players',
      DATA_TYPES.arraysmall,
      [
        ['id', DATA_TYPES.uint16],
        ['health', DATA_TYPES.healthenergy],
        ['healthRegen', DATA_TYPES.regen],
      ],
    ],
  ],

  [SERVER_PACKETS.PLAYER_KILL]: [
    ['id', DATA_TYPES.uint16],
    ['killer', DATA_TYPES.uint16],
    ['posX', DATA_TYPES.coordx],
    ['posY', DATA_TYPES.coordy],
  ],

  [SERVER_PACKETS.PLAYER_UPGRADE]: [
    ['upgrades', DATA_TYPES.uint16],
    ['type', DATA_TYPES.uint8],
    ['speed', DATA_TYPES.uint8],
    ['defense', DATA_TYPES.uint8],
    ['energy', DATA_TYPES.uint8],
    ['missile', DATA_TYPES.uint8],
  ],

  [SERVER_PACKETS.PLAYER_TYPE]: [['id', DATA_TYPES.uint16], ['type', DATA_TYPES.uint8]],

  [SERVER_PACKETS.PLAYER_POWERUP]: [['type', DATA_TYPES.uint8], ['duration', DATA_TYPES.uint32]],

  [SERVER_PACKETS.PLAYER_LEVEL]: [
    ['id', DATA_TYPES.uint16],
    ['type', DATA_TYPES.uint8],
    ['level', DATA_TYPES.uint8],
  ],

  [SERVER_PACKETS.PLAYER_RETEAM]: [
    ['players', DATA_TYPES.array, [['id', DATA_TYPES.uint16], ['team', DATA_TYPES.uint16]]],
  ],

  [SERVER_PACKETS.GAME_FLAG]: [
    ['type', DATA_TYPES.uint8],
    ['flag', DATA_TYPES.uint8],
    ['id', DATA_TYPES.uint16],
    ['posX', DATA_TYPES.coord24],
    ['posY', DATA_TYPES.coord24],
    ['blueteam', DATA_TYPES.uint8],
    ['redteam', DATA_TYPES.uint8],
  ],

  [SERVER_PACKETS.GAME_SPECTATE]: [['id', DATA_TYPES.uint16]],

  [SERVER_PACKETS.GAME_PLAYERSALIVE]: [['players', DATA_TYPES.uint16]],

  [SERVER_PACKETS.GAME_FIREWALL]: [
    ['type', DATA_TYPES.uint8],
    ['status', DATA_TYPES.uint8],
    ['posX', DATA_TYPES.coordx],
    ['posY', DATA_TYPES.coordy],
    ['radius', DATA_TYPES.float32],
    ['speed', DATA_TYPES.float32],
  ],

  [SERVER_PACKETS.EVENT_REPEL]: [
    ['clock', DATA_TYPES.uint32],
    ['id', DATA_TYPES.uint16],
    ['posX', DATA_TYPES.coordx],
    ['posY', DATA_TYPES.coordy],
    ['rot', DATA_TYPES.rotation],
    ['speedX', DATA_TYPES.speed],
    ['speedY', DATA_TYPES.speed],
    ['energy', DATA_TYPES.healthenergy],
    ['energyRegen', DATA_TYPES.regen],
    [
      'players',
      DATA_TYPES.arraysmall,
      [
        ['id', DATA_TYPES.uint16],
        ['keystate', DATA_TYPES.uint8],
        ['posX', DATA_TYPES.coordx],
        ['posY', DATA_TYPES.coordy],
        ['rot', DATA_TYPES.rotation],
        ['speedX', DATA_TYPES.speed],
        ['speedY', DATA_TYPES.speed],
        ['energy', DATA_TYPES.healthenergy],
        ['energyRegen', DATA_TYPES.regen],
        ['playerHealth', DATA_TYPES.healthenergy],
        ['playerHealthRegen', DATA_TYPES.regen],
      ],
    ],
    [
      'mobs',
      DATA_TYPES.arraysmall,
      [
        ['id', DATA_TYPES.uint16],
        ['type', DATA_TYPES.uint8],
        ['posX', DATA_TYPES.coordx],
        ['posY', DATA_TYPES.coordy],
        ['speedX', DATA_TYPES.speed],
        ['speedY', DATA_TYPES.speed],
        ['accelX', DATA_TYPES.accel],
        ['accelY', DATA_TYPES.accel],
        ['maxSpeed', DATA_TYPES.speed],
      ],
    ],
  ],

  [SERVER_PACKETS.EVENT_BOOST]: [
    ['clock', DATA_TYPES.uint32],
    ['id', DATA_TYPES.uint16],
    ['boost', DATA_TYPES.boolean],
    ['posX', DATA_TYPES.coord24],
    ['posY', DATA_TYPES.coord24],
    ['rot', DATA_TYPES.rotation],
    ['speedX', DATA_TYPES.speed],
    ['speedY', DATA_TYPES.speed],
    ['energy', DATA_TYPES.healthenergy],
    ['energyRegen', DATA_TYPES.regen],
  ],

  [SERVER_PACKETS.EVENT_BOUNCE]: [
    ['clock', DATA_TYPES.uint32],
    ['id', DATA_TYPES.uint16],
    ['keystate', DATA_TYPES.uint8],
    ['posX', DATA_TYPES.coord24],
    ['posY', DATA_TYPES.coord24],
    ['rot', DATA_TYPES.rotation],
    ['speedX', DATA_TYPES.speed],
    ['speedY', DATA_TYPES.speed],
  ],

  [SERVER_PACKETS.EVENT_STEALTH]: [
    ['id', DATA_TYPES.uint16],
    ['state', DATA_TYPES.boolean],
    ['energy', DATA_TYPES.healthenergy],
    ['energyRegen', DATA_TYPES.regen],
  ],

  [SERVER_PACKETS.EVENT_LEAVEHORIZON]: [['type', DATA_TYPES.uint8], ['id', DATA_TYPES.uint16]],

  [SERVER_PACKETS.MOB_UPDATE]: [
    ['clock', DATA_TYPES.uint32],
    ['id', DATA_TYPES.uint16],
    ['type', DATA_TYPES.uint8],
    ['posX', DATA_TYPES.coordx],
    ['posY', DATA_TYPES.coordy],
    ['speedX', DATA_TYPES.speed],
    ['speedY', DATA_TYPES.speed],
    ['accelX', DATA_TYPES.accel],
    ['accelY', DATA_TYPES.accel],
    ['maxSpeed', DATA_TYPES.speed],
  ],

  [SERVER_PACKETS.MOB_UPDATE_STATIONARY]: [
    ['id', DATA_TYPES.uint16],
    ['type', DATA_TYPES.uint8],
    ['posX', DATA_TYPES.float32],
    ['posY', DATA_TYPES.float32],
  ],

  [SERVER_PACKETS.MOB_DESPAWN]: [['id', DATA_TYPES.uint16], ['type', DATA_TYPES.uint8]],

  [SERVER_PACKETS.MOB_DESPAWN_COORDS]: [
    ['id', DATA_TYPES.uint16],
    ['type', DATA_TYPES.uint8],
    ['posX', DATA_TYPES.coordx],
    ['posY', DATA_TYPES.coordy],
  ],

  [SERVER_PACKETS.SCORE_UPDATE]: [
    ['id', DATA_TYPES.uint16],
    ['score', DATA_TYPES.uint32],
    ['earnings', DATA_TYPES.uint32],
    ['upgrades', DATA_TYPES.uint16],
    ['totalkills', DATA_TYPES.uint32],
    ['totaldeaths', DATA_TYPES.uint32],
  ],

  [SERVER_PACKETS.SCORE_BOARD]: [
    [
      'data',
      DATA_TYPES.array,
      [['id', DATA_TYPES.uint16], ['score', DATA_TYPES.uint32], ['level', DATA_TYPES.uint8]],
    ],
    [
      'rankings',
      DATA_TYPES.array,
      [['id', DATA_TYPES.uint16], ['x', DATA_TYPES.uint8], ['y', DATA_TYPES.uint8]],
    ],
  ],

  [SERVER_PACKETS.SCORE_DETAILED]: [
    [
      'scores',
      DATA_TYPES.array,
      [
        ['id', DATA_TYPES.uint16],
        ['level', DATA_TYPES.uint8],
        ['score', DATA_TYPES.uint32],
        ['kills', DATA_TYPES.uint16],
        ['deaths', DATA_TYPES.uint16],
        ['damage', DATA_TYPES.float32],
        ['ping', DATA_TYPES.uint16],
      ],
    ],
  ],

  [SERVER_PACKETS.SCORE_DETAILED_CTF]: [
    [
      'scores',
      DATA_TYPES.array,
      [
        ['id', DATA_TYPES.uint16],
        ['level', DATA_TYPES.uint8],
        ['captures', DATA_TYPES.uint16],
        ['score', DATA_TYPES.uint32],
        ['kills', DATA_TYPES.uint16],
        ['deaths', DATA_TYPES.uint16],
        ['damage', DATA_TYPES.float32],
        ['ping', DATA_TYPES.uint16],
      ],
    ],
  ],

  [SERVER_PACKETS.SCORE_DETAILED_BTR]: [
    [
      'scores',
      DATA_TYPES.array,
      [
        ['id', DATA_TYPES.uint16],
        ['level', DATA_TYPES.uint8],
        ['alive', DATA_TYPES.boolean],
        ['wins', DATA_TYPES.uint16],
        ['score', DATA_TYPES.uint32],
        ['kills', DATA_TYPES.uint16],
        ['deaths', DATA_TYPES.uint16],
        ['damage', DATA_TYPES.float32],
        ['ping', DATA_TYPES.uint16],
      ],
    ],
  ],

  [SERVER_PACKETS.CHAT_TEAM]: [['id', DATA_TYPES.uint16], ['text', DATA_TYPES.text]],

  [SERVER_PACKETS.CHAT_PUBLIC]: [['id', DATA_TYPES.uint16], ['text', DATA_TYPES.text]],

  [SERVER_PACKETS.CHAT_SAY]: [['id', DATA_TYPES.uint16], ['text', DATA_TYPES.text]],

  [SERVER_PACKETS.CHAT_WHISPER]: [
    ['from', DATA_TYPES.uint16],
    ['to', DATA_TYPES.uint16],
    ['text', DATA_TYPES.text],
  ],

  [SERVER_PACKETS.CHAT_VOTEMUTEPASSED]: [['id', DATA_TYPES.uint16]],

  [SERVER_PACKETS.CHAT_VOTEMUTED]: [],

  [SERVER_PACKETS.SERVER_MESSAGE]: [
    ['type', DATA_TYPES.uint8],
    ['duration', DATA_TYPES.uint32],
    ['text', DATA_TYPES.textbig],
  ],

  [SERVER_PACKETS.SERVER_CUSTOM]: [['type', DATA_TYPES.uint8], ['data', DATA_TYPES.textbig]],
};
