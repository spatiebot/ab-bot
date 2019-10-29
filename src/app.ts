
import { argv } from 'yargs';
import { AirmashBot } from './bot/airmash-bot';
import { AirmashApiFacade } from "./bot/airmash/airmash-api";
import { BotCharacter } from './bot/bot-character';
import { BotIdentityGenerator } from './bot-identity-generator';
import { LoggerConfig, logger } from './helper/logger';
import { Calculations } from './bot/calculations';

LoggerConfig.isDevelopment = !!argv.dev;

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

const flagConfig = <string>argv.flag || "random";
const typeConfig = <string>argv.type || "random";

const numBots = <number>argv.num || 1;

for (let i = 0; i < numBots; i++) {
    const identity = BotIdentityGenerator.create(flagConfig, typeConfig);

    const type = identity.aircraftType;
    const flag = identity.flag;
    let name = <string>argv.name || identity.name;
    const character = <string>argv.character;
    const botCharacter = BotCharacter[character] || BotCharacter.get(Number(type));

    logger.warn('Starting bot ' + i + ' with the following configuration:', {
        name,
        type,
        flag,
        character: botCharacter.name,
        url: ws
    });

    const env = new AirmashApiFacade(ws);
    const bot = new AirmashBot(env, botCharacter);

    // use a random timeout to prevent hiccups when X bots join the server at once
    const randomTimeout = Calculations.getRandomInt(numBots * 200, numBots * 2000);
    setTimeout(() => bot.start(name, flag, Number(type)), randomTimeout);
}