
import { argv } from 'yargs';
import { AirmashBot } from './bot/airmash-bot';
import { AirmashApiFacade } from "./bot/airmash/airmash-api";
import { BotCharacter } from './bot/bot-character';
import { BotIdentityGenerator } from './bot-identity-generator';
import { Logger } from './helper/logger';

const urls = {
    local: "ws://127.0.0.1:3501/ffa",
    euFfa1: "wss://eu.airmash.online/ffa1",
    euFfa2: "wss://eu.airmash.online/ffa2",
    euCtf: "wss://lags.win/ctf",
    usFfa: "wss://game.airmash.steamroller.tk/ffa",
    usCtf: "wss://game.airmash.steamroller.tk/ctf"
};

let ws = argv.ws as string;
if (ws && !ws.startsWith('ws') && !ws.startsWith('http')) {
    ws = urls[ws];
}
ws = ws || urls.euFfa1;

const flagConfig = argv.flag as string || "random";
const typeConfig = argv.type as string || "random";
const isSecondaryTeamCoordinator = !!argv.noTeamCoordinator;
const numBots = argv.num as number || 1;

for (let i = 0; i < numBots; i++) {
    const identity = BotIdentityGenerator.create(flagConfig, typeConfig);

    const type = identity.aircraftType;
    const flag = identity.flag;
    const name = argv.name as string || identity.name;
    const character = argv.character as string;
    const botCharacter = BotCharacter[character] || BotCharacter.get(Number(type));

    const logger = new Logger(i, name, !!argv.dev, (argv.level as string) || "warn");

    logger.info('Starting bot no ' + i + ' with the following configuration:', {
        name,
        type,
        flag,
        character: botCharacter.name,
        url: ws
    });

    const env = new AirmashApiFacade(ws, logger);
    env.start();
    const bot = new AirmashBot(env, logger, botCharacter, isSecondaryTeamCoordinator);

    // throttle joining of the bots to prevent spamming the server.
    const timeOutMs = i * 500;
    setTimeout(() => bot.join(name, flag, Number(type)), timeOutMs);
}