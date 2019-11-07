import { IAirmashEnvironment } from "./airmash/iairmash-environment";
import { BotCharacter } from "./bot-character";
import { Logger } from "../helper/logger";
import { AirmashBot } from "./airmash-bot";
import { TimeoutManager } from "../helper/timeoutManager";
import { AirmashApiFacade } from "./airmash/airmash-api";

export class BotContext {
    env: IAirmashEnvironment;
    character: BotCharacter;
    bot: AirmashBot;
    tm = new TimeoutManager();

    private websocketUrl: string;
    private botIndex: number;
    private name: string;
    private flag: string;
    private type: number;
    private isSecondaryTeamCoordinator: boolean;

    constructor(public logger: Logger, websocketUrl: string) {
        this.websocketUrl = websocketUrl;
    }

    startBot(i: number, name: string, flag: string, type: number, botCharacter: any, isSecondaryTeamCoordinator: boolean) {

        this.character = botCharacter;
        this.botIndex = i;
        this.isSecondaryTeamCoordinator = isSecondaryTeamCoordinator;
        this.name = name;
        this.flag = flag;
        this.type = type;

        this.restartBot();
    }

    restartBot() {
        this.tm.setTimeout(() => this.restartBotInner(), 4000);
    }

    private restartBotInner() {
        this.env = new AirmashApiFacade(this.websocketUrl, this.logger, this.tm);
        this.env.start();

        // throttle joining of the bots to prevent spamming the server.
        this.bot = new AirmashBot(this, this.isSecondaryTeamCoordinator);
        const timeOutMs = this.botIndex * 500;
        this.tm.setTimeout(() => this.bot.join(this.name, this.flag, this.type), timeOutMs);
    }

}