import { BotContext } from "./botContext";
import { StopWatch } from "./helper/timer";
import { PlayerInfo } from "./bot/airmash/player-info";

const NUM_BOTS_EVALUATION_INTERVAL_MINUTES = 0.5;
const NEED_FOR_BOTS_EVALUATION_INTERVAL_SECONDS = 1;

export class BotSpawner {
    private children: BotContext[] = [];
    private evaluateNumBotsTimer = new StopWatch();
    private evaluateNeedForBotsTimer = new StopWatch();
    private maxNumBots: number;
    private isFirstTime: boolean;

    constructor(private context: BotContext, numBots: number, private keepBots) {
        this.maxNumBots = numBots;
        this.isFirstTime = true;
    }

    start() {
        this.context.env.on("tick", () => this.onTick());
        this.evaluateNumBotsTimer.start();
        this.evaluateNeedForBotsTimer.start();
    }

    onTick(): any {
        this.evaluateNumBots();
        this.evaluateNeedForBots();
    }

    private evaluateNeedForBots() {
        if (this.evaluateNeedForBotsTimer.elapsedSeconds() < NEED_FOR_BOTS_EVALUATION_INTERVAL_SECONDS) {
            return;
        }

        this.evaluateNeedForBotsTimer.start();

        const botIds = this.children.map(x => x.env.myId());
        botIds.push(this.context.env.myId());

        // explicitly include dead players, b/c those are marked hidden too
        const numActivePlayers = this.context.env.getPlayers().filter(x =>
            botIds.indexOf(x.id) === -1 
            && (!x.isHidden || x.isDead)
            && PlayerInfo.isActive(x)
        ).length;

        const canPause = numActivePlayers === 0;
        this.children.forEach(x => x.bot.canPause = canPause);
        this.context.bot.canPause = canPause; // i can pause (or resume) too 
    }

    private evaluateNumBots() {

        if (!this.isFirstTime && this.evaluateNumBotsTimer.elapsedMinutes() < NUM_BOTS_EVALUATION_INTERVAL_MINUTES) {
            return;
        }

        this.evaluateNumBotsTimer.start();

        this.isFirstTime = false;

        const numPlayers = this.context.env.getPlayers().length;
        const maxNumPlayersWithBots = this.maxNumBots * 2;

        const totalBotsRequired = Math.min(maxNumPlayersWithBots - numPlayers, this.maxNumBots);
        const numBots = this.children.length + 1; // including me

        if (totalBotsRequired > 0) {
            const botsToAdd = totalBotsRequired - numBots;
            if (botsToAdd > 0) {
                let botIndex = this.context.botIndex;
                this.context.logger.warn("Adding " + botsToAdd + " new bots");
                for (let i = 0; i < botsToAdd; i++) {
                    botIndex++;
                    const newBotContext = this.context.spawnNewChildBot(botIndex);
                    this.children.push(newBotContext);
                }
            }
        } else if (totalBotsRequired < 0) {
            const botsToRemove = Math.min(Math.abs(totalBotsRequired), numBots - 1); // can't remove myself

            if (botsToRemove > 0 && !this.keepBots) {
                this.context.logger.warn("Removing " + botsToRemove + " bots");

                const killedBots = [];
                for (let i = 0; i < botsToRemove; i++) {
                    this.children[i].killBot();
                    killedBots.push(this.children[i]);
                }
                this.children = this.children.filter(x => killedBots.indexOf(x) === -1);
            }
        }


    }
}