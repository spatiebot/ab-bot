
import { argv } from 'yargs';
import { AirmashBot } from './bot/airmash-bot';
import { AirmashApiFacade } from "./bot/airmash/airmash-api";
import { BotCharacter } from './bot/bot-character';
import { BotIdentityGenerator } from './bot-identity-generator';
import { LoggerConfig, logger } from './helper/logger';

LoggerConfig.isDevelopment = !!argv.dev;

const urls = {
    local: "ws://127.0.0.1:3501/ffa",
    euFfa1: "wss://eu.airmash.online/ffa1",
    euFfa2: "wss://eu.airmash.online/ffa2",
    euCtf: "wss://lags.win/ctf",
    usFfa: "wss://game.airmash.steamroller.tk/ffa",
    usCtf: "wss://game.airmash.steamroller.tk/ctf"
};

let ws = <string>argv.ws;
if (ws && !ws.startsWith('ws') && !ws.startsWith('http')) {
    ws = urls[ws];
}
ws = ws || urls.euFfa1;

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

    logger.info('Starting bot no ' + i + ' with the following configuration:', {
        name,
        type,
        flag,
        character: botCharacter.name,
        url: ws
    });

    const env = new AirmashApiFacade(ws);
    env.startMainLoop();
    const bot = new AirmashBot(env, botCharacter);

    // throttle joining of the bots to prevent spamming the server.
    const timeOutMs = i * 500;
    setTimeout(() => bot.join(name, flag, Number(type)), timeOutMs);
}