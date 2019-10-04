
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
    euFfa: "wss://eu.airmash.online/ffa",
    euFfa2: "wss://eu-airmash1-foo.westeurope.cloudapp.azure.com/ffa",
    euCtf: "wss://eu.airmash.online/ctf",
    frCtf: "wss://lags.win/ctf",
    fooDev1: "ws://eu-airmash1-foo.westeurope.cloudapp.azure.com/dev?1",
    fooDev2: "ws://eu-airmash1-foo.westeurope.cloudapp.azure.com/dev?2"
};

let ws = <string>argv.ws;
if (ws && !ws.startsWith('ws') && !ws.startsWith('http')) {
    ws = urls[ws];
}
ws = ws || urls.euFfa;

const name = <string>argv.name || 'Botsy';
const type = <string>argv.type || '1';
const flag = <string>argv.flag || 'eu';
const character = <string>argv.character;
const botCharacter = BotCharacter[character] || BotCharacter.get(Number(type));

console.log('Starting with the following configuration:');
console.log('name: ' + name);
console.log('type: ' + type);
console.log('flag: ' + flag);
console.log('character: ' + botCharacter.name);
console.log('url: ' + ws);

var env = new AirmashApiFacade(ws);
const bot = new AirmashBot(env, botCharacter);
bot.start(name, flag, Number(type));
