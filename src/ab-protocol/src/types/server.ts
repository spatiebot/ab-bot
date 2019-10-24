/**
 * Protocol time, 10^-5 seconds.
 * Started from 0 at the moment of the server start.
 */
export type ClockTime = number;

/**
 * SERVER_PACKETS.ERROR types.
 */
export enum SERVER_ERRORS {
  PACKET_FLOODING_DISCONNECT = 1,
  PACKET_FLOODING_BAN = 2,
  GLOBAL_BAN = 3,
  UNKNOWN_ERROR = 4,
  REQUIRED_INACTIVITY_AND_HEALTH_TO_RESPAWN = 5,
  AFK_DISCONNECT = 6,
  PLAYER_KICKED = 7,
  INVALID_LOGIN_DATA = 8,
  INCORRECT_PROTOCOL = 9,
  ACCOUNT_BANNED = 10,
  ALREADY_LOGGED_IN = 11,
  FORBIDDEN_TO_CHANGE_PLANE_IN_BTR = 12,
  REQUIRED_INACTIVITY_AND_HEALTH_TO_SPECTATE = 13,
  NOT_ENOUGH_UPGRADES = 20,
  CHAT_SPAMMING = 30,
  FLAG_CHANGE_TOO_FAST = 31,
  UNKNOWN_COMMAND = 100,
}

/**
 * SERVER_PACKETS.SERVER_MESSAGE types.
 */
export enum SERVER_MESSAGE_TYPES {
  ALERT = 1,
  INFO = 2,
}

/**
 * SERVER_PACKETS.COMMAND_REPLY types.
 */
export enum COMMAND_REPLY_TYPES {
  /**
   * Special notification at the bottom of the chat.
   */
  CHAT = 0,

  /**
   * Popup. Use only for debug.
   */
  DEBUG = 1,
}

/**
 * SERVER_PACKETS.EVENT_LEAVEHORIZON types.
 */
export enum LEAVE_HORIZON_TYPES {
  PLAYER = 0,
  MOB = 1,
}

export enum MOB_TYPES {
  PLAYER = 0,

  // Projectiles
  PREDATOR_MISSILE = 1,
  GOLIATH_MISSILE = 2,
  COPTER_MISSILE = 3,
  TORNADO_MISSILE = 5,
  TORNADO_SMALL_MISSILE = 6,
  PROWLER_MISSILE = 7,

  // Boxes
  UPGRADE = 4,
  SHIELD = 8,
  INFERNO = 9,

  // BTR
  FIREWALL = 200,
}

/**
 * EXPIRED — box or projectile despawned.
 * PICKUP — player picked up a box.
 */
export enum MOB_DESPAWN_TYPES {
  EXPIRED = 0,
  PICKUP = 1,
}

export enum PLAYER_LEVEL_UPDATE_TYPES {
  INFORM = 0,
  LEVELUP = 1,
}

export enum PLAYER_STATUS {
  /**
   * On the map.
   */
  ALIVE = 0,

  /**
   * Dead or spectate
   */
  INACTIVE = 1,
}

export enum PLAYER_UPGRADE_TYPES {
  LOST = 0,
  SPEED = 1,
  DEFENSE = 2,
  ENERGY = 3,
  MISSILE = 4,
}

/**
 * SERVER_PACKETS.SERVER_CUSTOM types.
 */
export enum SERVER_CUSTOM_TYPES {
  CTF = 2,
  BTR = 1,
}

/**
 * SERVER_PACKETS.PLAYER_POWERUP types.
 */
export enum PLAYER_POWERUP_TYPES {
  SHIELD = 1,
  INFERNO = 2,
}

export enum CTF_TEAMS {
  BLUE = 1,
  RED = 2,
}

export enum CTF_FLAG_STATE {
  /**
   * Flag dropped.
   */
  STATIC = 1,

  /**
   * Frag currently owned by player.
   */
  DYNAMIC = 2,
}

/**
 * BASE — min bounty (if only one player online),
 * INCREMENT — an additional bounty for each online player
 */
export enum CTF_CAPTURE_BOUNTY {
  BASE = 100,
  INCREMENT = 100,
  MAX = 1000,
}

export enum BTR_FIREWALL_STATUS {
  INACTIVE = 0,
  ACTIVE = 1,
}

/**
 * BASE — min bounty (if only one player online),
 * INCREMENT — an additional bounty for each online player
 */
export enum CTF_WIN_BOUNTY {
  BASE = 100,
  INCREMENT = 100,
  MAX = 1000,
}

/**
 * BASE — min bounty (if only one player online),
 * INCREMENT — an additional bounty for each online player
 */
export enum BTR_WIN_BOUNTY {
  BASE = 500,
  INCREMENT = 500,
  MAX = 5000,
}

export enum GAME_TYPES {
  FFA = 1,
  CTF = 2,
  BTR = 3,
}

export enum GAME_STATE_CODES {
  LOGIN = 1,
  CONNECTING = 2,
  PLAYING = 3,
}

export const GAME_STATE_NAMES = Object.assign(
  {},
  ...Object.entries(GAME_STATE_CODES).map(([name, code]) => ({ [code]: name }))
);

export const MAP_SIZE = {
  WIDTH: 32768,
  HEIGHT: 16384,
};
