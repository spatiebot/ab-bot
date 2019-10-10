
import { argv } from 'yargs';
import { AirmashBot } from './bot/airmash-bot';
import { AirmashApiFacade } from "./bot/airmash/airmash-api";
import { BotCharacter } from './bot/bot-character';
import logger = require('./helper/logger');

const urls = {
    local: "ws://127.0.0.1:3501/ffa",
    euFfa: "wss://eu.airmash.online/ffa",
    euFfa2: "wss://eu-airmash1-foo.westeurope.cloudapp.azure.com/ffa",
    euCtf: "wss://lags.win/ctf",
    euCtf2: "wss://eu-airmash1-foo.westeurope.cloudapp.azure.com/ctf",
    euCtf3: "wss://eu.airmash.online/ctf",
    fooDev: "ws://eu-airmash1-foo.westeurope.cloudapp.azure.com/dev?1",
    ukDev: "wss://uk.test.airmash.online/dev",
    usFfa: "wss://game.airmash.steamroller.tk/ffa",
    usCtf: "wss://game.airmash.steamroller.tk/ctf",
    usDev: "wss://game.airmash.steamroller.tk/dev"
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

logger.info('Starting with the following configuration:', {
    name: name,
    type: type,
    flag: flag,
    character: botCharacter.name,
    url: ws
});

var env = new AirmashApiFacade(ws);
const bot = new AirmashBot(env, botCharacter);
bot.start(name, flag, Number(type));
