import { IAirmashEnvironment } from "./airmash/iairmash-environment";
import { SteeringInstallation } from "./steering/steering-installation";
import { BotCharacter } from "./bot-character";
import { Score } from "./airmash/score";
import { ApplyUpgrades } from "./apply-upgrades";
import { SteeringInstruction } from "./steering/steering-instruction";
import logger = require("../helper/logger");
import { ITargetSelection } from "./targetselection/itarget-selection";
import { TargetSelectionFactory } from "./targetselection/target-selection-factory";
import { StopWatch } from "../helper/timer";
import { FlagHelpers } from "../helper/flaghelpers";
import { TeamLeader } from "./team-leader";

export class AirmashBot {

    static current: AirmashBot;

    private readonly steeringInstallation: SteeringInstallation;
    private targetSelection: ITargetSelection;
    private aircraftType: number;
    private isSpawned: boolean;
    private score: Score;
    private isPreparingSteeringInstructions = false;

    private readonly tickStopwatch = new StopWatch();
    private readonly infoStopwatch = new StopWatch();
    private readonly upgradesStopwatch = new StopWatch();

    private teamleader: TeamLeader;

    constructor(private env: IAirmashEnvironment, private character: BotCharacter = null) {

        this.env.on('spawned', (x) => this.onSpawned(x));
        this.env.on('playerkilled', (x) => this.onPlayerKilled(x));
        this.env.on('error', (x) => this.onError(x));
        this.env.on('tick', () => this.onTick());
        this.env.on('chat', (msg) => this.onChat(msg));
        this.env.on('score', (score: Score) => this.onScore(score));
        this.env.on('ctfGameOver', () => this.onCtfGameOver());

        this.steeringInstallation = new SteeringInstallation(this.env);

        AirmashBot.current = this;
    }

    start(name: string, flag: string, aircraftType: number) {
        this.env.startMainLoop();
        this.aircraftType = aircraftType;
        this.env.joinGame(name, flag);
    }

    private onSpawned(data: any) {
        setTimeout(() => this.onEnvironmentReady(data), 100);
    }

    private onEnvironmentReady(data): void {

        if (data.id !== this.env.myId()) {
            return;
        }

        logger.info("i spawned");
        logger.info("Game type: " + this.env.getGameType());

        if (this.env.me().type !== this.aircraftType) {
            logger.info("... in the wrong body. Respawning as a different aircraft...");
            setTimeout(() => this.env.selectAircraft(this.aircraftType), 2000);
            return;
        }

        this.isSpawned = true;

        this.tickStopwatch.start();
        this.upgradesStopwatch.start();
        this.infoStopwatch.start();

        const myType = this.env.me().type;
        if (!this.character || this.character.type !== 0 && this.character.type !== myType) {
            logger.warn('new char selected because this character is not my type');
            this.character = BotCharacter.get(myType);
        }

        if (this.targetSelection) {
            this.targetSelection.dispose();
        }
        this.targetSelection = TargetSelectionFactory.createTargetSelection(this.env, this.character);

        this.steeringInstallation.start();
    }

    private onChat(msg) {
        const p = this.env.getPlayer(msg.id);
        const name = p ? p.name : "unknown";
        logger.info(name + ' says: "' + msg.text + '"');

        // ... has been chosen as the new team leader.
        // ... is still the team leader.
        //     has made ... the new team leader
        let teamLeaderMatch = /^(.*)\s(?:has\sbeen\schosen\sas\sthe\snew|is\sstill\sthe)\steam\sleader\./.exec(msg.text);
        if (!teamLeaderMatch) {
            teamLeaderMatch = /has\smade\s(.*)\sthe\snew\steam\sleader./.exec(msg.text);
        }
        if (teamLeaderMatch) {
            const newTeamLeader = teamLeaderMatch[1];
            if (newTeamLeader === this.env.me().name) {
                if (!this.teamleader) {
                    this.teamleader = new TeamLeader(this.env);
                }
            } else {
                this.teamleader = null;
            }
        }
    }

    private logState() {
        const me = this.env.me();
        logger.info(`Name: ${me.name}, Ping: ${this.env.getPing()}, upgrades: ${this.score.upgrades}`);
        logger.info(`Score: ${this.score.score}, energy: ${me.energy}, health: ${me.health}`);
        if (me.upgrades && (me.upgrades.speed === 0 || me.upgrades.speed > 0)) {
            logger.info(`Upgrade levels: speed ${me.upgrades.speed}, defense ${me.upgrades.defense}, energy ${me.upgrades.energy}, missile ${me.upgrades.missile}`);
        }
    }

    private onScore(score: Score) {
        this.score = score;
    }

    private reset() {
        this.steeringInstallation.reset();
        this.targetSelection.reset();
    }

    private onCtfGameOver() {
        this.isSpawned = false;
        this.steeringInstallation.stop();
        this.targetSelection.reset();
        logger.info("CTF game over");
    }

    private onTick() {

        if (this.tickStopwatch.elapsedMs() > 500) {
            logger.warn("Delay between ticks is long: " + this.tickStopwatch.elapsedMs());
        } else if (this.tickStopwatch.elapsedMs() > 1000) {
            logger.error("PANIC: delay between ticks too long: " + this.tickStopwatch.elapsedMs());
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
            const applyUpgrades = new ApplyUpgrades(this.env, this.character);
            applyUpgrades.execute(this.score);
        }

        if (this.infoStopwatch.elapsedSeconds() > 20) {
            this.logState();
            this.infoStopwatch.start();
        }

        this.prepareSteering();
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
                for (let i of instructions) {
                    const steeringInstruction = await i.getSteeringInstruction();
                    this.steeringInstallation.add(steeringInstruction);
                }
            } catch (err) {
                logger.error(err);
                logger.warn("Get steeringinstructions failed. Resetting target.");
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
            logger.info('I was killed or removed from the game');
            this.isSpawned = false;
            this.steeringInstallation.stop();
        } else if (data.killerID === this.env.myId()) {
            const other = this.env.getPlayer(data.killedID);
            const otherName = !!other ? other.name : "an unknown player";
            logger.info("I killed " + otherName);
        }
    }

    private onError(data: any) {
        logger.error('Error', data);
        this.env.stopMainLoop();
        this.steeringInstallation.stop();
    }
}