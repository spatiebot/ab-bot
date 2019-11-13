import { IAirmashEnvironment } from "./bot/airmash/iairmash-environment";
import { BotCharacter } from "./bot/bot-character";
import { Logger } from "./helper/logger";
import { AirmashBot } from "./bot/airmash-bot";
import { TimeoutManager } from "./helper/timeoutManager";
import { AirmashApiFacade } from "./bot/airmash/airmash-api";
import { StopWatch } from "./helper/timer";
import { BotIdentityGenerator } from "./bot-identity-generator";
import { BotSpawner } from "./bot-spawner";

const MAX_RESTART_TRIES = 3;

export class BotContext {
    env: IAirmashEnvironment;
    bot: AirmashBot;
    tm = new TimeoutManager();
    logger: Logger;
    character: BotCharacter;

    private lastRestartTimer = new StopWatch();
    private restartCount = 0;
    private spawner: BotSpawner;

    constructor(
        private websocketUrl: string,
        private identityGenerator: BotIdentityGenerator,
        private characterConfig: string,
        private isSecondaryTeamCoordinator: boolean,
        private isDevelopment: boolean,
        private logLevel: string,
        public botIndex: number,
        numBots: number = null,
        keepBots: boolean = false) {

        if (botIndex === 0) {
            // this is the first bot, which should manage the number of bots
            this.spawner = new BotSpawner(this, numBots, keepBots);
        }
    }

    startBot() {
        this.startBotInner();
    }

    killBot() {
        this.env.stop();
        this.tm.clearAll();
        this.bot.stop();
    }

    rebootBot() {
        this.killBot();
        this.logger.info("Restarting bot in a few seconds.");

        if (this.lastRestartTimer.elapsedMinutes() < 1) {
            this.restartCount++;
            if (this.restartCount > MAX_RESTART_TRIES) {
                // give up
                if (this.logger) {
                    this.logger.error("Too many restart tries; giving up.")
                }
                return;
            }
        } else {
            this.restartCount = 0;
        }

        this.tm.setTimeout(() => this.startBotInner(), 4000);
    }

    private startBotInner() {
        const identity = this.identityGenerator.generateIdentity();
        this.character = BotCharacter[this.characterConfig] || BotCharacter.get(identity.aircraftType);
        this.logger = new Logger(this.botIndex, identity.name, this.isDevelopment, this.logLevel);

        this.logger.info('Starting:', {
            type: identity.aircraftType,
            flag: identity.flag,
            character: this.character.name,
            url: this.websocketUrl,
        });

        this.lastRestartTimer.start();

        this.env = new AirmashApiFacade(this.websocketUrl, this.logger, this.tm);
        this.env.start();

        // throttle joining of the bots to prevent spamming the server.
        this.bot = new AirmashBot(this, this.isSecondaryTeamCoordinator);
        const timeOutMs = this.botIndex * 500;
        this.tm.setTimeout(() => this.bot.join(identity.name, identity.flag, identity.aircraftType), timeOutMs);

        if (this.spawner) {
            // this is the first bot: it should keep track of the number of bots
            this.spawner.start();
        }
    }

    spawnNewChildBot(botIndex: number): BotContext {
        const context = new BotContext(this.websocketUrl, this.identityGenerator, this.characterConfig,
            this.isSecondaryTeamCoordinator, this.isDevelopment, this.logLevel, botIndex);
        context.startBot();
        return context;
    }


}