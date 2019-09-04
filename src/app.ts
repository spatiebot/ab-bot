import { Game } from "./Game";
import { Network } from "./Network";

const steamDev = "wss://game.airmash.steamroller.tk/dev";
const steamFfa = "wss://game.airmash.steamroller.tk/ffa";
const wightFfa = "wss://game-eu-s1.airbattle.xyz/ffa";
const wightCtf = "wss://game-eu-s1.airbattle.xyz/ctf";
const frCtf = "wss://lags.win/ctf";

var network = new Network(steamDev);
var game = new Game(network);
game.start("Kees Rundvlees", "sk");