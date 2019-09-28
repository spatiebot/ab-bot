
import { argv } from 'yargs';
import { AirmashBot } from './bot/airmash-bot';
import { Grid, Util, AStarFinder } from "pathfinding";
import { PathFindingFacade } from './bot/instructions/pathfinding-facade';
import { AirmashApiFacade } from "./bot/airmash/airmash-api";
import { BotCharacter } from './bot/bot-character';

PathFindingFacade.Grid = Grid;
PathFindingFacade.Util = Util;
PathFindingFacade.AStarFinder = AStarFinder;

const urls = {
    local: "ws://127.0.0.1:3501/ffa",
    steamDev: "wss://game.airmash.steamroller.tk/dev",
    steamFfa: "wss://game.airmash.steamroller.tk/ffa",
    wightFfa: "wss://game-eu-s1.airbattle.xyz/ffa",
    wightCtf: "wss://game-eu-s1.airbattle.xyz/ctf",
    frCtf: "wss://lags.win/ctf",
    fooDev1: "ws://eu-airmash1-foo.westeurope.cloudapp.azure.com/dev?1",
    fooDev2: "ws://eu-airmash1-foo.westeurope.cloudapp.azure.com/dev?2"
};

let ws = <string>argv.ws;
if (ws && !ws.startsWith('ws') && !ws.startsWith('http')) {
    ws = urls[ws];
}
ws = ws || urls.wightFfa;

const name = <string>argv.name || 'Poopbot';
const type = <number>argv.type || 1;
const flag = <string>argv.flag || 'sk';

var env = new AirmashApiFacade(ws);
const bot = new AirmashBot(env, BotCharacter.CrateStealer);
bot.start(name, flag, type);
