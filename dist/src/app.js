"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Game_1 = require("./Game");
const Network_1 = require("./Network");
const steamDev = "wss://game.airmash.steamroller.tk/dev";
const steamFfa = "wss://game.airmash.steamroller.tk/ffa";
const wightFfa = "wss://game-eu-s1.airbattle.xyz/ffa";
const wightCtf = "wss://game-eu-s1.airbattle.xyz/ctf";
const frCtf = "wss://lags.win/ctf";
var network = new Network_1.Network(steamDev);
var game = new Game_1.Game(network);
game.start("Kees Rundvlees", "sk");
//# sourceMappingURL=app.js.map