import { Backup, Ping, PingResult, Error, CommandReply, PlayerLeave, PlayerUpgrade, PlayerPowerup, PlayerReteam, GamePlayersalive, GameFirewall, ChatWhisper, ScoreBoard, ScoreDetailed, ServerCustom } from '../schemas/server';
declare const _default: {
    [x: number]: (() => Backup) | ((buffer: ArrayBuffer) => Ping) | ((buffer: ArrayBuffer) => PingResult) | ((buffer: ArrayBuffer) => Error) | ((buffer: ArrayBuffer) => CommandReply) | ((buffer: ArrayBuffer) => PlayerLeave) | ((buffer: ArrayBuffer) => PlayerUpgrade) | ((buffer: ArrayBuffer) => PlayerPowerup) | ((buffer: ArrayBuffer) => PlayerReteam) | ((buffer: ArrayBuffer) => GamePlayersalive) | ((buffer: ArrayBuffer) => GameFirewall) | ((buffer: ArrayBuffer) => ChatWhisper) | ((buffer: ArrayBuffer) => ScoreBoard) | ((buffer: ArrayBuffer) => ScoreDetailed) | ((buffer: ArrayBuffer) => ServerCustom);
};
export default _default;
