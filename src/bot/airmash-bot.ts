import { IAirmashEnvironment } from "./airmash/iairmash-environment";
import { ITarget } from "./targets/itarget";
import { OtherPlayerTarget } from "./targets/other-player-target";
import { SteeringInstallation } from "./steering/steering-installation";
import { BotCharacter } from "./bot-character";
import { CrateTarget } from "./targets/crate-target";
import { DodgeMissileTarget } from "./targets/dodge-missile-target";
import { Score } from "./airmash/score";
import { DropCratesTarget } from "./targets/drop-crates-target";
import { PoopState } from "./targets/poop-state";
import { FleeTarget } from "./targets/flee-target";

export class AirmashBot {

    static current: AirmashBot;

    private readonly steeringInstallation: SteeringInstallation;
    private aircraftType: number;
    private target: ITarget;
    private lastLoggedTarget: string;
    private predodgeTarget: ITarget;
    private prefleeTarget: ITarget;
    private isSpawned: boolean;
    private score: Score;
    private poopState: PoopState;

    constructor(private env: IAirmashEnvironment, private character: BotCharacter = null) {

        this.env.on('spawned', (x) => this.onSpawned(x));
        this.env.on('playerkilled', (x) => this.onPlayerKilled(x));
        this.env.on('error', (x) => this.onError(x));
        this.env.on('tick', () => this.onTick());
        this.env.on('score', (score: Score) => {
            this.score = score;
            console.log(`Score: ${score.score}, upgrades: ${score.upgrades}`);
        });
        this.env.on('chat', (msg) => this.onChat(msg));

        this.steeringInstallation = new SteeringInstallation(this.env);
        this.poopState = new PoopState();

        AirmashBot.current = this;
    }

    start(name: string, flag: string, aircraftType: number) {
        this.env.startMainLoop();
        this.aircraftType = aircraftType;
        this.env.joinGame(name, flag, aircraftType);
    }

    private onSpawned(data: any) {
        const id = data.id;
        if (!this.env.me() || this.env.me().type !== this.aircraftType) {
            console.log("Waiting for env to be ready");
            setTimeout(() => this.onSpawned(id), 300);
        } else {
            if (!id || id === this.env.myId()) {
                console.log("i spawned");
                this.isSpawned = true;

                const myType = this.env.me().type;
                if (!this.character || this.character.type !== 0 && this.character.type !== myType) {
                    this.character = BotCharacter.get(myType);
                }
                this.steeringInstallation.start();
            }
        }
    }

    private onChat(msg) {
        const p = this.env.getPlayer(msg.id);
        const name = p ? p.name : "unknown";
        console.log("Chat: " + name + ": " + msg.text);
        this.poopState.onChat(msg.id, msg.text);
    }

    private onTick() {
        if (!this.isSpawned) {
            return;
        }

        this.selectTarget();

        if (this.target && this.target.isValid()) {
            if (this.lastLoggedTarget !== this.target.goal) {
                this.lastLoggedTarget = this.target.goal;
                console.log("Target: " + this.target.goal);
            }
            const instructions = this.target.getInstructions();
            for (let i of instructions) {
                this.steeringInstallation.add(i.getSteeringInstruction());
            }
        }
    }

    private selectTarget() {
        const hasTarget = !!this.target;
        const hasSecondaryGoal = hasTarget && this.target.goal !== this.character.goal;
        const isTargetValid = hasTarget && this.target.isValid();
        const shouldSelectTarget = !hasTarget || hasSecondaryGoal || !isTargetValid;

        // doding bullets is always a priority
        const dodge = new DodgeMissileTarget(this.env, this.character);
        if (dodge.isValid()) {
            if (this.target && this.target.goal !== 'dodge') {
                this.predodgeTarget = this.target; // to restore it after dodging was ready
            }
            this.target = dodge;
            return;
        }

        if (this.predodgeTarget) {
            // restore the pre-dodge target
            this.target = this.predodgeTarget;
            this.predodgeTarget = null;
        }

        // fleeing is the second priority
        const flee = new FleeTarget(this.env, this.character);
        if (flee.isValid()) {
            if (this.target && this.target.goal !== 'flee') {
                this.prefleeTarget = this.target; // to restore after fleeing is ready
            }
            this.target = flee;
            return;
        }

        if (this.prefleeTarget) {
            this.target = this.prefleeTarget;
            this.prefleeTarget = null;
        }

        if (shouldSelectTarget) {
            let potentialNewTarget: ITarget;
            if (this.character.goal === 'stealCrates') {
                potentialNewTarget = new DropCratesTarget(this.env, this.score, this.poopState);
                if (!potentialNewTarget.isValid()) {
                    potentialNewTarget = new CrateTarget(this.env, this.poopState);
                }
            }
            else if (this.character.goal === 'fight') {
                potentialNewTarget = new OtherPlayerTarget(this.env, this.character);
            }

            if (potentialNewTarget.isValid()) {
                this.target = potentialNewTarget;
            } else {
                if (!hasTarget || !isTargetValid) {
                    // no valid target found, and we also did not have a valid target
                    // so take the default target 
                    this.target = new OtherPlayerTarget(this.env, this.character);
                }
            }
        }

    }

    private onPlayerKilled(data: any) {
        if (data.killedID === this.env.myId()) {
            console.log('I was killed');
            this.isSpawned = false;
            this.steeringInstallation.stop();
        } else if (data.killerID === this.env.myId()) {
            const other = this.env.getPlayer(data.killedID);
            const otherName = !!other ? other.name : "an unknown player";
            console.log("I killed " + otherName);
        }
        if (this.target) {
            this.target.onKill(data.killerID, data.killedID);
        }
    }

    private onError(data: any) {
        console.log('Error', data);
        this.env.stopMainLoop();
    }

}