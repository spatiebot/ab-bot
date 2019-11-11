import { BotContext } from "./botContext";
import { StopWatch } from "./helper/timer";

const EVALUATION_INTERVAL_MINUTES = 0.5;

export class BotSpawner {
    private children: BotContext[] = [];
    private evaluateTimer = new StopWatch();
    private maxNumChildren: number;
    private isFirstTime: boolean;

    constructor(private context: BotContext, numBots: number) {
        this.maxNumChildren = numBots - 1; // -1 for myself.
        this.isFirstTime = true;
    }

    start() {
        this.context.env.on("tick", () => this.onTick());
        this.evaluateTimer.start();
    }

    onTick(): any {
        if (!this.isFirstTime && this.evaluateTimer.elapsedMinutes() < EVALUATION_INTERVAL_MINUTES) {
            return;
        }
        
        this.evaluateTimer.start();

        this.isFirstTime = false;

        const numPlayers = this.context.env.getPlayers().length;
        const maxNumPlayersWithBots = this.maxNumChildren * 2;

        const totalBotsRequired = Math.min(maxNumPlayersWithBots - numPlayers, this.maxNumChildren);
        const numBots = this.children.length;

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
            const botsToRemove = Math.min(Math.abs(totalBotsRequired), numBots);

            if (botsToRemove > 0) {
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