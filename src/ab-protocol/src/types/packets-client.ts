import { ProtocolPacket } from '../packets';

/**
 * Login request.
 * First request after connection open.
 */
export interface Login extends ProtocolPacket {
  /**
   * Protocol major version.
   */
  protocol?: number;

  /**
   * Desired player name.
   */
  name?: string;

  /**
   * User session.
   */
  session?: string;

  /**
   * Half-width screen value.
   * Game map units.
   */
  horizonX?: number;

  /**
   * Half-height screen value.
   * Game map units.
   */
  horizonY?: number;

  /**
   * Desired country flag.
   */
  flag?: string;
}

/**
 * Request from backup connection to associate with the player.
 */
export interface Backup extends ProtocolPacket {
  /**
   * Token from `Login` response.
   */
  token?: string;
}

/**
 * Request new viewport size.
 */
export interface Horizon extends ProtocolPacket {
  /**
   * Half-width screen value.
   * Game map units.
   */
  horizonX?: number;

  /**
   * Half-height screen value.
   * Game map units.
   */
  horizonY?: number;
}

/**
 * Ack.
 * Look for an explanation on HN.
 */
export interface Ack extends ProtocolPacket {}

/**
 * Response to `Ping` request.
 */
export interface Pong extends ProtocolPacket {
  /**
   * Response validation token.
   */
  num?: number;
}

/**
 * Update key state.
 */
export interface Key extends ProtocolPacket {
  /**
   * Key press/release increasing id.
   */
  seq?: number;

  /**
   * Key code.
   */
  key?: number;

  /**
   * Press state.
   * true — pressed.
   */
  state?: boolean;
}

/**
 * Send command.
 */
export interface Command extends ProtocolPacket {
  /**
   * Command name.
   */
  com?: string;

  /**
   * Command arguments.
   */
  data?: string;
}

/**
 * Request `ScoreDetailed`, `ScoreDetailedCtf` or `ScoreDetailedBtr` response.
 */
export interface Scoredetailed extends ProtocolPacket {}

/**
 * Send message in the public chat.
 */
export interface Chat extends ProtocolPacket {
  /**
   * Message content.
   */
  text?: string;
}

/**
 * Send private message to player.
 */
export interface Whisper extends ProtocolPacket {
  /**
   * Recipient ID.
   */
  id?: number;

  /**
   * Message content.
   */
  text?: string;
}

/**
 * Send message in the say chat.
 */
export interface Say extends ProtocolPacket {
  /**
   * Message content.
   */
  text?: string;
}

/**
 * Send message in the team chat.
 */
export interface Teamchat extends ProtocolPacket {
  /**
   * Message content.
   */
  text?: string;
}

/**
 * Vote to mute player.
 */
export interface Votemute extends ProtocolPacket {
  /**
   * Player ID.
   */
  id?: number;
}

/**
 * Currently not used.
 */
export interface Localping extends ProtocolPacket {
  auth?: number;
}
