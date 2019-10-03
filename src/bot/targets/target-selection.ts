import { ITarget } from "./itarget";
import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { FleeTarget } from "./flee-target";
import { DodgeMissileTarget } from "./dodge-missile-target";
import { BotCharacter } from "../bot-character";
import { DropCratesTarget } from "./drop-crates-target";
import { PoopState } from "./poop-state";
import { Score } from "../airmash/score";
import { CrateTarget } from "./crate-target";
import { OtherPlayerTarget } from "./other-player-target";
import { DoNothingTarget } from "./do-nothing.target";

export class TargetSelection {
    private target: ITarget;
    private lastLoggedTarget: string;
    private poopState: PoopState;
    private score: Score;

    constructor(private env: IAirmashEnvironment, private character: BotCharacter) {
        this.poopState = new PoopState();
        this.env.on('chat', (msg) => this.onChat(msg));
        this.env.on('playerkilled', (x) => this.onPlayerKilled(x));
        this.env.on('score', (score: Score) => {
            this.score = score;
            console.log(`Score: ${score.score}, upgrades: ${score.upgrades}`);
        });
    }

    private onChat(msg) {
        this.poopState.onChat(msg.id, msg.text);
    }

    private onPlayerKilled(data: any) {
        if (this.target) {
            this.target.onKill(data.killerID, data.killedID);
        }
    }

    getTarget(): ITarget {
        let target = this.getPriorityTarget();
        if (!target) {
            this.selectRegularTarget();
            target = this.target;
        }

        if (this.lastLoggedTarget !== target.goal) {
            this.lastLoggedTarget = target.goal;
            console.log("Target: " + target.goal);
        }

        return target;
    }

    private getPriorityTarget(): ITarget {
        // dodging bullets is always a priority
        const dodge = new DodgeMissileTarget(this.env, this.character);
        if (dodge.isValid()) {
            return dodge;
        }

        // fleeing is the second priority
        const flee = new FleeTarget(this.env, this.character);
        if (flee.isValid()) {
            return flee;
        }

        return null;
    }

    private selectRegularTarget(): void {

        const hasTarget = !!this.target;
        const isFulfillingPrimaryGoal = hasTarget && this.target.goal === this.character.goal;
        const isTargetValid = hasTarget && this.target.isValid();
        const isLastResortTarget = isTargetValid && this.target.goal === "nothing"

        if (isTargetValid && isFulfillingPrimaryGoal) {
            // no need to select another target
            return;
        }

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

        if (potentialNewTarget && potentialNewTarget.isValid()) {
            this.target = potentialNewTarget;
            return;
        }

        // now we have a failed attempt at selecting a new target, while it's still necessary to select one.
        // maybe on second thought it's not that important. At least we need a valid target, even if it
        // does not fufill the primary goal
        if (isTargetValid && !isLastResortTarget) {
            return;
        }

        // so take the default target then
        this.target = new OtherPlayerTarget(this.env, this.character);

        if (!this.target.isValid()) {
            // even the default target failed. We're out of ideas.
            this.target = new DoNothingTarget();
        }
    }
}