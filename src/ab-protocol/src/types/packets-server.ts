import { ProtocolPacket } from '../packets';
import {
  CTF_TEAMS,
  CTF_FLAG_STATE,
  SERVER_CUSTOM_TYPES,
  SERVER_MESSAGE_TYPES,
  MOB_DESPAWN_TYPES,
  MOB_TYPES,
  LEAVE_HORIZON_TYPES,
  PLAYER_LEVEL_UPDATE_TYPES,
  PLAYER_POWERUP_TYPES,
  BTR_FIREWALL_STATUS,
  PLAYER_STATUS,
  ClockTime,
  SERVER_ERRORS,
  COMMAND_REPLY_TYPES,
  PLAYER_UPGRADE_TYPES,
} from './server';

/**
 * Connected player.
 */
export interface LoginPlayer {
  /**
   * Player ID.
   */
  id?: number;

  /**
   * Player alive status.
   */
  status?: PLAYER_STATUS;

  /**
   * Account level.
   */
  level?: number;

  /**
   * Unique player name assigned by server.
   */
  name?: string;

  /**
   * Airplane type.
   */
  type?: number;

  /**
   * Player team ID.
   */
  team?: number;

  /**
   * Player high-res position X.
   */
  posX?: number;

  /**
   * Player high-res position Y.
   */
  posY?: number;

  /**
   * Player rotation.
   */
  rot?: number;

  /**
   * Player country flag.
   */
  flag?: number;

  /**
   * `encodeUpgrades` result. See lib function.
   */
  upgrades?: number;
}

/**
 * Response on client `Login`.
 */
export interface Login extends ProtocolPacket {
  /**
   * Currently not used.
   */
  success?: boolean;

  /**
   * Player ID.
   */
  id?: number;

  /**
   * Player team.
   */
  team?: number;

  /**
   * Packet time.
   */
  clock?: ClockTime;

  /**
   * Token to init backup connection.
   */
  token?: string;

  /**
   * Airplane type.
   */
  type?: number;

  /**
   * Server name.
   */
  room?: string;

  /**
   * List of connected players.
   */
  players?: LoginPlayer[];
}

/**
 * Empty packet. Currently not used.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Backup extends ProtocolPacket {}

/**
 * Ping request.
 */
export interface Ping extends ProtocolPacket {
  /**
   * Packet time.
   */
  clock?: ClockTime;

  /**
   * Random number to validate `Pong` response.
   */
  num?: number;
}

/**
 * Response on client `Pong`.
 */
export interface PingResult extends ProtocolPacket {
  /**
   * Player ping, ms.
   */
  ping?: number;

  /**
   * Total players among the servers group (like EU, US, ASIA, etc.).
   */
  playerstotal?: number;

  /**
   * Total players on this game server.
   */
  playersgame?: number;
}

/**
 * Empty packet. Currently not used.
 */
export interface Ack extends ProtocolPacket {}

/**
 * Error notification. Only informing, it doesn't disconnect the player.
 */
export interface Error extends ProtocolPacket {
  /**
   * Error ID.
   */
  error?: SERVER_ERRORS;
}

/**
 * Response on the client `Command`.
 */
export interface CommandReply extends ProtocolPacket {
  /**
   * Reply type ID.
   */
  type?: COMMAND_REPLY_TYPES;

  /**
   * Reply content.
   */
  text?: string;
}

/**
 * New player connected.
 */
export interface PlayerNew extends ProtocolPacket {
  /**
   * Player ID.
   */
  id?: number;

  /**
   * Player alive status.
   */
  status?: PLAYER_STATUS;

  /**
   * Unique player name assigned by server.
   */
  name?: string;

  /**
   * Airplane type.
   */
  type?: number;

  /**
   * Player team.
   */
  team?: number;

  /**
   * Player high-res position X.
   */
  posX?: number;

  /**
   * Player high-res position Y.
   */
  posY?: number;

  /**
   * Player rotation.
   */
  rot?: number;

  /**
   * Player country code.
   */
  flag?: number;

  /**
   * `encodeUpgrades` result. See lib function.
   */
  upgrades?: number;
}

/**
 * Player disconnected.
 */
export interface PlayerLeave extends ProtocolPacket {
  /**
   * Player ID.
   */
  id?: number;
}

/**
 * Player update state.
 */
export interface PlayerUpdate extends ProtocolPacket {
  /**
   * Packet time.
   */
  clock?: ClockTime;

  /**
   * Player ID.
   */
  id?: number;

  /**
   * `encodeKeystate` result. See lib function.
   */
  keystate?: number;

  /**
   * `encodeUpgrades` result. See lib function.
   */
  upgrades?: number;

  /**
   * Player high-res position X.
   */
  posX?: number;

  /**
   * Player high-res position Y.
   */
  posY?: number;

  /**
   * Player rotation.
   */
  rot?: number;

  /**
   * Player velocity vector X.
   */
  speedX?: number;

  /**
   * Player velocity vector Y.
   */
  speedY?: number;
}

/**
 * Player fired projectile.
 */
export interface PlayerFireProjectile {
  /**
   * Projectile ID.
   */
  id?: number;

  /**
   * Projectile type.
   */
  type?: MOB_TYPES;

  /**
   * Projectile high-res position X.
   */
  posX?: number;

  /**
   * Projectile high-res position Y.
   */
  posY?: number;

  /**
   * Projectile start velocity vector X.
   * Depends on player velocity and flight direction.
   */
  speedX?: number;

  /**
   * Projectile start velocity vector Y.
   * Depends on player velocity and flight direction.
   */
  speedY?: number;

  /**
   * Acceleration vector X.
   * Depends on owner upgrades at the moment of fire.
   */
  accelX?: number;

  /**
   * Acceleration vector Y.
   * Depends on owner upgrades at the moment of fire.
   */
  accelY?: number;

  /**
   * Maximum projectile speed.
   * Depends on owner upgrades at the moment of fire.
   */
  maxSpeed?: number;
}

/**
 * Player fired projectiles.
 */
export interface PlayerFire extends ProtocolPacket {
  /**
   * Packet time.
   */
  clock?: ClockTime;

  /**
   * Player ID.
   */
  id?: number;

  /**
   * Player energy.
   */
  energy?: number;

  /**
   * Energy regen.
   * Depends on player upgrades.
   */
  energyRegen?: number;

  /**
   * Fired projectiles.
   */
  projectiles?: PlayerFireProjectile[];
}

/**
 * Player respawned.
 */
export interface PlayerRespawn extends ProtocolPacket {
  /**
   * Player ID.
   */
  id?: number;

  /**
   * Player high-res position X.
   */
  posX?: number;

  /**
   * Player high-res position Y.
   */
  posY?: number;

  /**
   * Player rotation.
   */
  rot?: number;

  /**
   * `encodeUpgrades` result. See lib function.
   */
  upgrades?: number;
}

/**
 * Player country flag update.
 */
export interface PlayerFlag extends ProtocolPacket {
  /**
   * Player ID.
   */
  id?: number;

  /**
   * Flag country code.
   */
  flag?: number;
}

/**
 * Hurted victim.
 */
export interface PlayerHitPlayer {
  /**
   * Victim ID.
   */
  id?: number;

  /**
   * Victim health.
   */
  health?: number;

  /**
   * Victim health regen.
   * Depends on victim airplane type.
   */
  healthRegen?: number;
}

/**
 * Projectile hit player(s).
 */
export interface PlayerHit extends ProtocolPacket {
  /**
   * Projectile ID.
   */
  id?: number;

  /**
   * Projectile type.
   */
  type?: MOB_TYPES;

  /**
   * Hit high-res position X (projectile explosion position).
   */
  posX?: number;

  /**
   * Hit high-res position Y (projectile explosion position).
   */
  posY?: number;

  /**
   * Projectile owner ID.
   */
  owner?: number;

  /**
   * Hurted victims.
   */
  players?: PlayerHitPlayer[];
}

/**
 * Player was killed or removed from the map.
 * Used with spectate packet for the fast remove
 * spectator from the map (spectator receives {spectatorId, 0, 0, 0}).
 */
export interface PlayerKill extends ProtocolPacket {
  /**
   * Victim ID.
   */
  id?: number;

  /**
   * Killer ID.
   */
  killer?: number;

  /**
   * Death high-res position X.
   */
  posX?: number;

  /**
   * Death high-res position Y.
   */
  posY?: number;
}

/**
 * Player applied (but not picked up the box) or lost upgrades.
 */
export interface PlayerUpgrade extends ProtocolPacket {
  /**
   * Player free upgrades.
   */
  upgrades?: number;

  /**
   * Action type: lose or apply.
   */
  type?: PLAYER_UPGRADE_TYPES;

  /**
   * Active speed upgrades.
   */
  speed?: number;

  /**
   * Active defense upgrades.
   */
  defense?: number;

  /**
   * Active energy upgrades.
   */
  energy?: number;

  /**
   * Active missile upgrades.
   */
  missile?: number;
}

/**
 * Player changed airplane type.
 */
export interface PlayerType extends ProtocolPacket {
  /**
   * Player ID.
   */
  id?: number;

  /**
   * Airplane type.
   */
  type?: number;
}

/**
 * Player received powerup.
 */
export interface PlayerPowerup extends ProtocolPacket {
  /**
   * Powerup type.
   */
  type?: PLAYER_POWERUP_TYPES;

  /**
   * Powerup duration.
   */
  duration?: number;
}

/**
 * Player level info.
 */
export interface PlayerLevel extends ProtocolPacket {
  /**
   * Player ID.
   */
  id?: number;

  /**
   * Level info type.
   */
  type?: PLAYER_LEVEL_UPDATE_TYPES;

  /**
   * Player level > 0.
   */
  level?: number;
}

/**
 * New player team.
 */
export interface PlayerReteamPlayers {
  /**
   * Player ID.
   */
  id?: number;

  /**
   * Player new team ID.
   */
  team?: number;
}

/**
 * Players changed their teams.
 */
export interface PlayerReteam extends ProtocolPacket {
  /**
   * Players list.
   */
  players?: PlayerReteamPlayers[];
}

/**
 * Update CTF flag state or team score.
 */
export interface GameFlag extends ProtocolPacket {
  /**
   * Flag state.
   */
  type?: CTF_FLAG_STATE;

  /**
   * Flag team.
   */
  flag?: CTF_TEAMS;

  /**
   * Flag owner ID.
   */
  id?: number;

  /**
   * Flag high-res position X.
   * If CTF_FLAG_STATE = DYNAMIC it doesn't matter.
   */
  posX?: number;

  /**
   * Flag high-res position Y.
   * If CTF_FLAG_STATE = DYNAMIC it doesn't matter.
   */
  posY?: number;

  /**
   * Blue team score.
   */
  blueteam?: number;

  /**
   * Red team score.
   */
  redteam?: number;
}

/**
 * Switch into spectator mode or change spectating player.
 */
export interface GameSpectate extends ProtocolPacket {
  /**
   * ID of spectated player.
   */
  id?: number;
}

/**
 * BTF game state.
 */
export interface GamePlayersalive extends ProtocolPacket {
  /**
   * Total players alive.
   */
  players?: number;
}

/**
 * BTF firewall state.
 */
export interface GameFirewall extends ProtocolPacket {
  /**
   * Currently not used.
   */
  type?: number;

  /**
   * Firewall activity status.
   */
  status?: BTR_FIREWALL_STATUS;

  /**
   * Firewall high-res position X.
   */
  posX?: number;

  /**
   * Firewall high-res position Y.
   */
  posY?: number;

  /**
   * Firewall radius.
   */
  radius?: number;

  /**
   * Firewall reducing speed.
   */
  speed?: number;
}

/**
 * Repeled victim.
 */
export interface EventRepelPlayer {
  /**
   * Victim ID.
   */
  id?: number;

  /**
   * `encodeKeystate` result. See lib function.
   */
  keystate?: number;

  /**
   * Victim high-res position X.
   */
  posX?: number;

  /**
   * Victim high-res position Y.
   */
  posY?: number;

  /**
   * Victim rotation.
   */
  rot?: number;

  /**
   * Victim speed vector X.
   */
  speedX?: number;

  /**
   * Victim speed vector Y.
   */
  speedY?: number;

  /**
   * Victim energy.
   */
  energy?: number;

  /**
   * Victim energy regen.
   * Depends on victim upgrades.
   */
  energyRegen?: number;

  /**
   * Victim health.
   */
  playerHealth?: number;

  /**
   * Victim health regen.
   */
  playerHealthRegen?: number;
}

/**
 * Repeled projectile.
 */
export interface EventRepelMob {
  /**
   * Projectile ID.
   */
  id?: number;

  /**
   * Projectile type.
   */
  type?: MOB_TYPES;

  /**
   * Projectile high-res position X.
   */
  posX?: number;

  /**
   * Projectile high-res position Y.
   */
  posY?: number;

  /**
   * Projectile new velocity vector X.
   */
  speedX?: number;

  /**
   * Projectile new velocity vector Y.
   */
  speedY?: number;

  /**
   * Projectile new acceleration vector X.
   */
  accelX?: number;

  /**
   * Projectile new acceleration vector Y.
   */
  accelY?: number;

  /**
   * Maximum projectile speed.
   */
  maxSpeed?: number;
}

export interface EventRepel extends ProtocolPacket {
  /**
   * Packet time.
   */
  clock?: ClockTime;

  /**
   * Repel owner.
   */
  id?: number;

  /**
   * Repel center position X.
   */
  posX?: number;

  /**
   * Repel center position Y.
   */
  posY?: number;

  /**
   * Owner rotation.
   */
  rot?: number;

  /**
   * Owner velocity vector X.
   */
  speedX?: number;

  /**
   * Owner velocity vector Y.
   */
  speedY?: number;

  /**
   * Owner energy.
   */
  energy?: number;

  /**
   * Owner energy regen.
   * Depends on player upgrades.
   */
  energyRegen?: number;

  /**
   * Repeled players.
   */
  players?: EventRepelPlayer[];

  /**
   * Repeled projectiles.
   */
  mobs?: EventRepelMob[];
}

/**
 * Predator start or stop boost.
 */
export interface EventBoost extends ProtocolPacket {
  /**
   * Packet time.
   */
  clock?: ClockTime;

  /**
   * Player ID.
   */
  id?: number;

  /**
   * true — boost start, false — stop.
   */
  boost?: boolean;

  /**
   * Player high-res position X.
   */
  posX?: number;

  /**
   * Player high-res position Y.
   */
  posY?: number;

  /**
   * Player rotation.
   */
  rot?: number;

  /**
   * Player velocity vector X.
   */
  speedX?: number;

  /**
   * Player velocity vector Y.
   */
  speedY?: number;

  /**
   * Player energy.
   */
  energy?: number;

  /**
   * Player energy regen.
   * Depends on player upgrades.
   */
  energyRegen?: number;
}

/**
 * Player bounced from the mountain.
 */
export interface EventBounce extends ProtocolPacket {
  /**
   * Packet time.
   */
  clock?: ClockTime;

  /**
   * Player ID.
   */
  id?: number;

  /**
   * `encodeKeystate` result. See lib function.
   */
  keystate?: number;

  /**
   * Player high-res position X.
   */
  posX?: number;

  /**
   * Player high-res position Y.
   */
  posY?: number;

  /**
   * Player rotation.
   */
  rot?: number;

  /**
   * Player new velocity vector X after bounce.
   */
  speedX?: number;

  /**
   * Player new velocity vector Y after bounce.
   */
  speedY?: number;
}

/**
 * Prowler stealth state.
 */
export interface EventStealth extends ProtocolPacket {
  /**
   * Player ID.
   */
  id?: number;

  /**
   * true — player invisible, false — visible.
   */
  state?: boolean;

  /**
   * Player energy.
   */
  energy?: number;

  /**
   * Player energy regen.
   * Depends on player upgrades.
   */
  energyRegen?: number;
}

/**
 * Player or mob (projectile, powerup or upgrade) leaves screen
 * of the player received the packet. Actually not the screen,
 * but the viewport, which depends on scale factor. It may be more
 * or less of the player real screen.
 */
export interface EventLeavehorizon extends ProtocolPacket {
  /**
   * Object type
   */
  type?: LEAVE_HORIZON_TYPES;

  /**
   * Mob/Player ID.
   */
  id?: number;
}

/**
 * Spawn projectile on the player screen.
 */
export interface MobUpdate extends ProtocolPacket {
  /**
   * Packet time.
   */
  clock?: ClockTime;

  /**
   * Projectile ID.
   */
  id?: number;

  /**
   * Projectile type.
   */
  type?: MOB_TYPES;

  /**
   * Projectile high-res position X.
   */
  posX?: number;

  /**
   * Projectile high-res position Y.
   */
  posY?: number;

  /**
   * Projectile velocity vector X.
   */
  speedX?: number;

  /**
   * Projectile velocity vector Y.
   */
  speedY?: number;

  /**
   * Projectile acceleration vector X.
   * Depends on owner upgrades at the moment of fire.
   */
  accelX?: number;

  /**
   * Projectile acceleration vector Y.
   * Depends on owner upgrades at the moment of fire.
   */
  accelY?: number;

  /**
   * Maximum projectile speed.
   * Depends on owner upgrades at the moment of fire.
   */
  maxSpeed?: number;
}

/**
 * Spawn/show box (powerup or upgrade) on the player screen.
 */
export interface MobUpdateStationary extends ProtocolPacket {
  /**
   * Mob ID.
   */
  id?: number;

  /**
   * Mob type.
   */
  type?: MOB_TYPES;

  /**
   * Mob high-res position X.
   */
  posX?: number;

  /**
   * Mob high-res position Y.
   */
  posY?: number;
}

/**
 * Projectile, powerup or upgrade was despawned or picked up (boxes only).
 */
export interface MobDespawn extends ProtocolPacket {
  /**
   * Mob ID.
   */
  id?: number;

  /**
   * Mob despawn reason.
   */
  type?: MOB_DESPAWN_TYPES;
}

/**
 * Projectile hit a mountain.
 */
export interface MobDespawnCoords extends ProtocolPacket {
  /**
   * Projectile ID.
   */
  id?: number;

  /**
   * Projectile type.
   */
  type?: MOB_TYPES;

  /**
   * Projectile high-res position X.
   */
  posX?: number;

  /**
   * Projectile high-res position Y.
   */
  posY?: number;
}

/**
 * Player was killed, killed another player, got a new level
 * or picked up an upgrade.
 */
export interface ScoreUpdate extends ProtocolPacket {
  /**
   * Player ID.
   */
  id?: number;

  /**
   * Player score.
   */
  score?: number;

  /**
   * Only for accounts.
   *
   * Total score acquired by player at the current level.
   * Total score earned by player over the entile account life of
   * an account = result of `levelToBouty` + this `earnings` value.
   *
   * See `levelToBouty` lib function.
   */
  earnings?: number;

  /**
   * Free player upgrades.
   */
  upgrades?: number;

  /**
   * Total player account (or current guest session) kills.
   */
  totalkills?: number;

  /**
   * Total player account (or current guest session) deaths.
   */
  totaldeaths?: number;
}

/**
 * Sorted list of players.
 */
export interface ScoreBoardData {
  /**
   * Player ID.
   */
  id?: number;

  /**
   * Player score.
   */
  score?: number;

  /**
   * Player level.
   */
  level?: number;
}

/**
 * Sorted list of players.
 * If position (0, 0) — player in spectator mode.
 */
export interface ScoreBoardRanking {
  /**
   * Player ID.
   */
  id?: number;

  /**
   * Low resolution position X.
   */
  x?: number;

  /**
   * Low resolution position Y.
   */
  y?: number;
}

/**
 * Minimap and players rates and states update.
 */
export interface ScoreBoard extends ProtocolPacket {
  /**
   * Players score.
   */
  data?: ScoreBoardData[];

  /**
   * Players location and state (spectate or not).
   */
  rankings?: ScoreBoardRanking[];
}

/**
 * FFA rating item.
 */
export interface ScoreDetailedScore {
  /**
   * Player ID.
   */
  id?: number;

  /**
   * Player level.
   */
  level?: number;

  /**
   * Player score during game session.
   */
  score?: number;

  /**
   * Player kills during game session.
   */
  kills?: number;

  /**
   * Player deaths during game session.
   */
  deaths?: number;

  /**
   * Player damage during game session.
   */
  damage?: number;

  /**
   * Player last ping value.
   */
  ping?: number;
}

/**
 * FFA sorted players list.
 */
export interface ScoreDetailed extends ProtocolPacket {
  scores?: ScoreDetailedScore[];
}

/**
 * CTF rating item.
 */
export interface ScoreDetailedCtfScore {
  /**
   * Player ID.
   */
  id?: number;

  /**
   * Player level.
   */
  level?: number;

  /**
   * Flag captures by player during game session.
   */
  captures?: number;

  /**
   * Player score during game session.
   */
  score?: number;

  /**
   * Player kills during game session.
   */
  kills?: number;

  /**
   * Player deaths during game session.
   */
  deaths?: number;

  /**
   * Player damage during game session.
   */
  damage?: number;

  /**
   * Player last ping value.
   */
  ping?: number;
}

/**
 * CTF sorted players list.
 */
export interface ScoreDetailedCtf extends ProtocolPacket {
  /**
   * Players score.
   */
  scores?: ScoreDetailedCtfScore[];
}

/**
 * BTR rating item.
 */
export interface ScoreDetailedBtrScore {
  /**
   * Player ID.
   */
  id?: number;

  /**
   * Player level.
   */
  level?: number;

  /**
   * Player alive or not.
   */
  alive?: boolean;

  /**
   * Player wins during game session.
   */
  wins?: number;

  /**
   * Player score during game session.
   */
  score?: number;

  /**
   * Player kills during game session.
   */
  kills?: number;

  /**
   * Player deaths during game session.
   */
  deaths?: number;

  /**
   * Player damage during game session.
   */
  damage?: number;

  /**
   * Player last ping value.
   */
  ping?: number;
}

/**
 * BTR sorted players list.
 */
export interface ScoreDetailedBtr extends ProtocolPacket {
  /**
   * Players score.
   */
  scores?: ScoreDetailedBtrScore[];
}

/**
 * New team chat message by player.
 */
export interface ChatTeam extends ProtocolPacket {
  /**
   * Message owner ID.
   */
  id?: number;

  /**
   * Message content.
   */
  text?: string;
}

/**
 * New public chat message by player.
 */
export interface ChatPublic extends ProtocolPacket {
  /**
   * Message owner ID.
   */
  id?: number;

  /**
   * Message content.
   */
  text?: string;
}

/**
 * New public say message by player.
 */
export interface ChatSay extends ProtocolPacket {
  /**
   * Message owner ID.
   */
  id?: number;

  /**
   * Message content.
   */
  text?: string;
}

/**
 * New whisper message.
 */
export interface ChatWhisper extends ProtocolPacket {
  /**
   * Message owner ID.
   */
  from?: number;

  /**
   * Recipient ID.
   */
  to?: number;

  /**
   * Message content.
   */
  text?: string;
}

/**
 * Player was muted.
 */
export interface ChatVotemutepassed extends ProtocolPacket {
  /**
   * Muted player ID.
   */
  id?: number;
}

/**
 * Player was muted. Response on player attempt to chat.
 */
export interface ChatVotemuted extends ProtocolPacket {}

/**
 * Server HTML message.
 */
export interface ServerMessage extends ProtocolPacket {
  type?: SERVER_MESSAGE_TYPES;

  /**
   * Duration on the screen.
   */
  duration?: number;

  /**
   * Message content.
   */
  text?: string;
}

/**
 * CTF end game alert data.
 */
export interface ServerCustomCTFData {
  /**
   * Winner team.
   */
  w: CTF_TEAMS;

  /**
   * Bounty reward.
   */
  b: number;

  /**
   * Alert duration.
   */
  t: number;
}

/**
 * BTR end game alert data.
 */
export interface ServerCustomBTRData {
  /**
   * Winner country flag code.
   */
  f: number;

  /**
   * Winner name.
   */
  p: string;

  /**
   * Winner kills.
   */
  k: number;

  /**
   * Bounty reward.
   */
  b: number;

  /**
   * Alert duration.
   */
  t: number;
}

/**
 * CTF or BTR end game alert.
 */
export interface ServerCustom extends ProtocolPacket {
  /**
   * Game mode type.
   */
  type?: SERVER_CUSTOM_TYPES;

  /**
   * JSON.
   */
  data?: string;
}
