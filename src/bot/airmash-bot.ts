import { IAirmashEnvironment } from "./airmash/iairmash-environment";
import { SteeringInstallation } from "./steering/steering-installation";
import { BotCharacter } from "./bot-character";
import { Score } from "./airmash/score";
import { ApplyUpgrades } from "./apply-upgrades";
import { SteeringInstruction } from "./steering/steering-instruction";
import { ITargetSelection } from "./targetselection/itarget-selection";
import { TargetSelectionFactory } from "./targetselection/target-selection-factory";
import { StopWatch } from "../helper/timer";
import { FlagHelpers } from "../helper/flaghelpers";
import { TeamLeader } from "./team-leader";
import { Logger } from "../helper/logger";
import { TeamCoordination } from "../teamcoordination/team-coordination";
import { Slave } from "../teamcoordination/slave";
import { PlaneTypeSelection } from "./plane-type-selection";
import { TeamLeaderChatHelper } from "../helper/teamleader-chat-helper";
import { BotContext } from "./botContext";

export class AirmashBot {

    private readonly steeringInstallation: SteeringInstallation;
    private targetSelection: ITargetSelection;
    private isSpawned: boolean;
    private score: Score;
    private isPreparingSteeringInstructions = false;

    private readonly tickStopwatch = new StopWatch();
    private readonly infoStopwatch = new StopWatch();
    private readonly upgradesStopwatch = new StopWatch();

    private teamleader: TeamLeader; // for leading as if i was a player
    private teamCoordination: TeamCoordination; // for coordinating the ctf bots
    private slave: Slave; // for executing commands from the teamleader via the teamcoordinator
    private planeTypeSelection: PlaneTypeSelection;

    private get env(): IAirmashEnvironment {
        return this.context.env;
    }
    
    private get logger(): Logger {
        return this.context.logger;
    }
    
    private get character(): BotCharacter {
        return this.context.character;
    }

    constructor(private context: BotContext, isSecondaryTeamCoordinator: boolean) {

        this.env.on('spawned', (x) => this.onSpawned(x));
        this.env.on('playerkilled', (x) => this.onPlayerKilled(x));
        this.env.on('error', (x) => this.onError(x));
        this.env.on('tick', () => this.onTick());
        this.env.on('chat', (msg) => this.onChat(msg));
        this.env.on('score', (score: Score) => this.onScore(score));
        this.env.on('ctfGameOver', () => this.onCtfGameOver());

        this.steeringInstallation = new SteeringInstallation(context);
        this.teamCoordination = new TeamCoordination(context, isSecondaryTeamCoordinator);
        this.slave = new Slave(this.context);
        this.teamCoordination.addSlave(this.slave);
        this.planeTypeSelection = new PlaneTypeSelection();
    }

    join(name: string, flag: string, aircraftType: number) {
        this.planeTypeSelection.aircraftType = aircraftType;
        this.env.joinGame(name, flag);
    }

    private onSpawned(data: any) {
        const me = this.env.me();

        if (!me) {
            // environment not ready yet
            this.context.tm.setTimeout(() => this.onSpawned(data), 100);
            return;
        }

        if (me.id !== data.id) {
            // another player (re)spawned
            return;
        }

        this.startBot();
    }

    private async startBot() {

        const me = this.env.me();

        this.logger.info("i spawned");
        this.logger.info("Game type: " + this.env.getGameType());

        if (me.type !== this.planeTypeSelection.aircraftType) {
            this.logger.info("... in the wrong body. Respawning as a different aircraft...", { me: me.type, sel: this.planeTypeSelection.aircraftType });

            await this.planeTypeSelection.switch(this.env, this.context.tm);
            return; // this method will be called again
        }

        this.isSpawned = true;

        this.tickStopwatch.start();
        this.upgradesStopwatch.start();
        this.infoStopwatch.start();

        const myType = this.env.me().type;
        if (!this.character || this.character.type !== 0 && this.character.type !== myType) {
            this.logger.warn('new char selected because this character is not my type');
            this.context.character = BotCharacter.get(myType);
        }

        if (this.targetSelection) {
            this.targetSelection.dispose();
        }
        this.targetSelection = TargetSelectionFactory.createTargetSelection(this.context, this.slave);

        this.steeringInstallation.start();
    }

    async switchTo(aircraftType: number) {
        if (!this.isSpawned) {
            return;
        }

        this.stop();
        this.planeTypeSelection.aircraftType = aircraftType;
        this.startBot();

        // restart bot if this didn't work
        this.context.tm.setTimeout(() => {
            if (this.isSpawned) {
                return; // it worked.
            }
            // prevent switching again, this obviously didn't work
            this.planeTypeSelection.aircraftType = this.env.me().type;
            this.startBot();
        }, 10000);
    }

    private onChat(msg) {
        const p = this.env.getPlayer(msg.id);
        const name = p ? p.name : "unknown";
        this.logger.info(name + ' says: "' + msg.text + '"');

        const newTeamleaderID = TeamLeaderChatHelper.getTeamleaderId(msg.text, this.env);
        if (newTeamleaderID) {
            if (newTeamleaderID === this.env.myId()){
                this.teamleader = new TeamLeader(this.env);
            } else {
                this.teamleader = null;
            }
        }
    }

    private logState() {
        const me = this.env.me();
        this.logger.info('BotInfo', { name: me.name, ping: this.env.getPing() });
        this.logger.info('BotInfo', { score: this.score.score, energy: me.energy, health: me.health });
        if (me.upgrades && (me.upgrades.speed === 0 || me.upgrades.speed > 0)) {
            this.logger.info('Upgrade levels', me.upgrades);
        }
    }

    private onScore(score: Score) {
        this.score = score;
    }

    private reset() {
        this.steeringInstallation.reset();
        this.targetSelection.reset();
    }

    private stop() {
        this.isSpawned = false;
        this.steeringInstallation.stopAllSteering();
        this.targetSelection.reset();
    }

    private onCtfGameOver() {
        this.stop();
        this.teamleader = null;
        this.logger.info("CTF game over");
    }

    private async onTick() {

        if (this.tickStopwatch.elapsedMs() > 500) {
            this.logger.warn("Delay between ticks is long: " + this.tickStopwatch.elapsedMs());
        } else if (this.tickStopwatch.elapsedMs() > 1000) {
            this.logger.error("PANIC: delay between ticks too long: " + this.tickStopwatch.elapsedMs());
            this.reset();
        }
        this.tickStopwatch.start();

        if (this.teamleader) {
            this.teamleader.lead();
        }

        if (!this.isSpawned) {
            return;
        }

        if (this.upgradesStopwatch.elapsedMs() > 5000) {
            const applyUpgrades = new ApplyUpgrades(this.env, this.logger, this.character);
            applyUpgrades.execute(this.score);
        }

        if (this.infoStopwatch.elapsedSeconds() > 20) {
            this.logState();
            this.infoStopwatch.start();
        }

        try {
            await this.prepareSteering();
        } catch (err) {
            this.logger.error('error preparing steering', err);
        }
    }

    private async prepareSteering(): Promise<any> {
        if (this.isPreparingSteeringInstructions) {
            return;
        }
        this.isPreparingSteeringInstructions = true;

        try {
            const target = this.targetSelection.exec();
            const instructions = target.getInstructions();
            try {
                for (const i of instructions) {
                    const steeringInstruction = await i.getSteeringInstruction();
                    this.steeringInstallation.add(steeringInstruction);
                }
            } catch (err) {
                this.logger.info("Get steeringinstructions failed. Resetting target.", err);
                this.reset();
            }

            //prowler should be as stealthed as possible
            const me = this.env.me();
            if (me.type === 5 && me.energy > 0.6 && !me.isStealthed) {
                if (!FlagHelpers.isCarryingFlag(this.env)) {
                    const stealthInstruction = new SteeringInstruction();
                    stealthInstruction.stealth = true;
                    this.steeringInstallation.add(stealthInstruction);
                }
            }

            this.steeringInstallation.executeWhenReady();

        } finally {
            this.isPreparingSteeringInstructions = false;
        }
    }

    private onPlayerKilled(data: any) {
        if (data.killedID === this.env.myId()) {
            this.logger.info('I was killed or removed from the game');
            this.isSpawned = false;
            this.steeringInstallation.stop();
        } else if (data.killerID === this.env.myId()) {
            const other = this.env.getPlayer(data.killedID);
            const otherName = other ? other.name : "an unknown player";
            this.logger.info("I killed " + otherName);
        }
    }

    private onError(data: any) {
        this.logger.error('Error', data ? JSON.stringify(data, Object.getOwnPropertyNames(data)) : "unknown error");
        this.restart();
    }

    restart() {
        this.env.stop();
        this.steeringInstallation.stop();
        this.context.tm.clearAll();
        this.teamCoordination.stop();

        this.logger.warn("Restarting bot in a few seconds.");
        this.context.restartBot();
    }
}