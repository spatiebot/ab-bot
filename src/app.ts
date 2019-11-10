
import { argv } from 'yargs';
import { BotCharacter } from './bot/bot-character';
import { BotIdentityGenerator } from './bot-identity-generator';
import { Logger } from './helper/logger';
import { BotContext } from './bot/botContext';

const urls = {
    local: "ws://127.0.0.1:3501/ffa",
    euFfa1: "wss://eu.airmash.online/ffa1",
    euFfa2: "wss://eu.airmash.online/ffa2",
    euCtf: "wss://lags.win/ctf",
    usFfa: "wss://game.airmash.steamroller.tk/ffa",
    usCtf1: "wss://game.airmash.steamroller.tk/ctf",
    usCtf2: "wss://airmash.xyz/ctf1"
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

    const context = new BotContext(logger, ws);
    context.startBot(i, name, flag, Number(type), botCharacter, isSecondaryTeamCoordinator);
}