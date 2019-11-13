
import { argv } from 'yargs';
import { BotIdentityGenerator } from './bot-identity-generator';
import { BotContext } from './botContext';

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
const characterConfig = argv.character as string;
const isSecondaryTeamCoordinator = !!argv.noTeamCoordinator;
const numBots = argv.num as number || 1;
const keepBots = !!argv.keep;
const isDevelopment = !!argv.dev;
const logLevel = argv.level as string || "warn";

const identityGenerator = new BotIdentityGenerator(flagConfig, typeConfig, argv.name as string);

// start with one bot, it will spawn new bots as needed.
const context = new BotContext(ws, identityGenerator, characterConfig, isSecondaryTeamCoordinator, isDevelopment, logLevel, 0, numBots, keepBots);
context.startBot();
