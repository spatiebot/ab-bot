import { DATA_TYPES } from '../types/data';
import { WSPacket } from '../packets';
import { CTF_TEAMS, CTF_FLAG_STATE, SERVER_CUSTOM_TYPES, SERVER_MESSAGE_TYPES, MOB_DESPAWN_TYPES, MOB_TYPES, LEAVE_HORIZON_TYPES, PLAYER_LEVEL_UPDATE_TYPES, PLAYER_POWERUP_TYPES } from '../types/server';
interface LoginPlayer {
    id?: number;
    status?: number;
    level?: number;
    name?: string;
    type?: number;
    team?: number;
    posX?: number;
    posY?: number;
    rot?: number;
    flag?: number;
    upgrades?: number;
}
export interface Login extends WSPacket {
    success?: boolean;
    id?: number;
    team?: number;
    clock?: number;
    token?: string;
    type?: number;
    room?: string;
    players?: LoginPlayer[];
}
export interface Backup extends WSPacket {
}
export interface Ping extends WSPacket {
    clock?: number;
    num?: number;
}
export interface PingResult extends WSPacket {
    ping?: number;
    playerstotal?: number;
    playersgame?: number;
}
export interface Ack extends WSPacket {
}
export interface Error extends WSPacket {
    error?: number;
}
export interface CommandReply extends WSPacket {
    type?: number;
    text?: string;
}
export interface PlayerNew extends WSPacket {
    id?: number;
    status?: number;
    name?: string;
    type?: number;
    team?: number;
    posX?: number;
    posY?: number;
    rot?: number;
    flag?: number;
    upgrades?: number;
}
export interface PlayerLeave extends WSPacket {
    id?: number;
}
export interface PlayerUpdate extends WSPacket {
    clock?: number;
    id?: number;
    keystate?: number;
    upgrades?: number;
    posX?: number;
    posY?: number;
    rot?: number;
    speedX?: number;
    speedY?: number;
}
interface PlayerFireProjectile {
    id?: number;
    type?: number;
    posX?: number;
    posY?: number;
    speedX?: number;
    speedY?: number;
    accelX?: number;
    accelY?: number;
    maxSpeed?: number;
}
export interface PlayerFire extends WSPacket {
    clock?: number;
    id?: number;
    energy?: number;
    energyRegen?: number;
    projectiles?: PlayerFireProjectile[];
}
export interface PlayerRespawn extends WSPacket {
    id?: number;
    posX?: number;
    posY?: number;
    rot?: number;
    upgrades?: number;
}
export interface PlayerFlag extends WSPacket {
    id?: number;
    flag?: number;
}
interface PlayerHitPlayer {
    id?: number;
    health?: number;
    healthRegen?: number;
}
export interface PlayerHit extends WSPacket {
    id?: number;
    type?: number;
    posX?: number;
    posY?: number;
    owner?: number;
    players?: PlayerHitPlayer[];
}
export interface PlayerKill extends WSPacket {
    id?: number;
    killer?: number;
    posX?: number;
    posY?: number;
}
export interface PlayerUpgrade extends WSPacket {
    upgrades?: number;
    type?: number;
    speed?: number;
    defense?: number;
    energy?: number;
    missile?: number;
}
export interface PlayerType extends WSPacket {
    id?: number;
    type?: number;
}
export interface PlayerPowerup extends WSPacket {
    type?: PLAYER_POWERUP_TYPES;
    duration?: number;
}
export interface PlayerLevel extends WSPacket {
    id?: number;
    type?: PLAYER_LEVEL_UPDATE_TYPES;
    level?: number;
}
interface PlayerReteamPlayers {
    id?: number;
    team?: number;
}
export interface PlayerReteam extends WSPacket {
    players?: PlayerReteamPlayers[];
}
export interface GameFlag extends WSPacket {
    type?: CTF_FLAG_STATE;
    flag?: CTF_TEAMS;
    id?: number;
    posX?: number;
    posY?: number;
    blueteam?: number;
    redteam?: number;
}
export interface GameSpectate extends WSPacket {
    id?: number;
}
export interface GamePlayersalive extends WSPacket {
    players?: number;
}
export interface GameFirewall extends WSPacket {
    type?: number;
    status?: number;
    posX?: number;
    posY?: number;
    radius?: number;
    speed?: number;
}
interface EventRepelPlayer {
    id?: number;
    keystate?: number;
    posX?: number;
    posY?: number;
    rot?: number;
    speedX?: number;
    speedY?: number;
    energy?: number;
    energyRegen?: number;
    playerHealth?: number;
    playerHealthRegen?: number;
}
interface EventRepelMob {
    id?: number;
    type?: number;
    posX?: number;
    posY?: number;
    speedX?: number;
    speedY?: number;
    accelX?: number;
    accelY?: number;
    maxSpeed?: number;
}
export interface EventRepel extends WSPacket {
    clock?: number;
    id?: number;
    posX?: number;
    posY?: number;
    rot?: number;
    speedX?: number;
    speedY?: number;
    energy?: number;
    energyRegen?: number;
    players?: EventRepelPlayer[];
    mobs?: EventRepelMob[];
}
export interface EventBoost extends WSPacket {
    clock?: number;
    id?: number;
    boost?: boolean;
    posX?: number;
    posY?: number;
    rot?: number;
    speedX?: number;
    speedY?: number;
    energy?: number;
    energyRegen?: number;
}
export interface EventBounce extends WSPacket {
    clock?: number;
    id?: number;
    keystate?: number;
    posX?: number;
    posY?: number;
    rot?: number;
    speedX?: number;
    speedY?: number;
}
export interface EventStealth extends WSPacket {
    id?: number;
    state?: boolean;
    energy?: number;
    energyRegen?: number;
}
export interface EventLeavehorizon extends WSPacket {
    type?: LEAVE_HORIZON_TYPES;
    id?: number;
}
export interface MobUpdate extends WSPacket {
    clock?: number;
    id?: number;
    type?: MOB_TYPES;
    posX?: number;
    posY?: number;
    speedX?: number;
    speedY?: number;
    accelX?: number;
    accelY?: number;
    maxSpeed?: number;
}
export interface MobUpdateStationary extends WSPacket {
    id?: number;
    type?: MOB_TYPES;
    posX?: number;
    posY?: number;
}
export interface MobDespawn extends WSPacket {
    id?: number;
    type?: MOB_DESPAWN_TYPES;
}
export interface MobDespawnCoords extends WSPacket {
    id?: number;
    type?: MOB_TYPES;
    posX?: number;
    posY?: number;
}
export interface ScoreUpdate extends WSPacket {
    id?: number;
    score?: number;
    earnings?: number;
    upgrades?: number;
    totalkills?: number;
    totaldeaths?: number;
}
interface ScoreBoardData {
    id?: number;
    score?: number;
    level?: number;
}
interface ScoreBoardRanking {
    id?: number;
    x?: number;
    y?: number;
}
export interface ScoreBoard extends WSPacket {
    data?: ScoreBoardData[];
    rankings?: ScoreBoardRanking[];
}
interface ScoreDetailedScore {
    id?: number;
    level?: number;
    score?: number;
    kills?: number;
    deaths?: number;
    damage?: number;
    ping?: number;
}
export interface ScoreDetailed extends WSPacket {
    scores?: ScoreDetailedScore[];
}
interface ScoreDetailedCtfScore {
    id?: number;
    level?: number;
    captures?: number;
    score?: number;
    kills?: number;
    deaths?: number;
    damage?: number;
    ping?: number;
}
export interface ScoreDetailedCtf extends WSPacket {
    scores?: ScoreDetailedCtfScore[];
}
interface ScoreDetailedBtrScore {
    id?: number;
    level?: number;
    alive?: boolean;
    wins?: number;
    score?: number;
    kills?: number;
    deaths?: number;
    damage?: number;
    ping?: number;
}
export interface ScoreDetailedBtr extends WSPacket {
    scores?: ScoreDetailedBtrScore[];
}
export interface ChatTeam extends WSPacket {
    id?: number;
    text?: string;
}
export interface ChatPublic extends WSPacket {
    id?: number;
    text?: string;
}
export interface ChatSay extends WSPacket {
    id?: number;
    text?: string;
}
export interface ChatWhisper extends WSPacket {
    from?: number;
    to?: number;
    text?: string;
}
export interface ChatVotemutepassed extends WSPacket {
    id?: number;
}
export interface ChatVotemuted extends WSPacket {
}
export interface ServerMessage extends WSPacket {
    type?: SERVER_MESSAGE_TYPES;
    duration?: number;
    text?: string;
}
export interface ServerCustom extends WSPacket {
    type?: SERVER_CUSTOM_TYPES;
    data?: string;
}
declare const _default: {
    [x: number]: (string | DATA_TYPES | (string | DATA_TYPES)[][])[][];
};
export default _default;
