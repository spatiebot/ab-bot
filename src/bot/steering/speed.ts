import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { SteeringState } from "./steering-state";
import { PlayerInfo } from "../airmash/player-info";
import { BotContext } from "../../botContext";

export class Speed {
    private boost: SteeringState = new SteeringState('SPECIAL');
    private up: SteeringState = new SteeringState('UP');
    private down: SteeringState = new SteeringState('DOWN');
    private currentBoostTimeout: any;

    private get env(): IAirmashEnvironment {
        return this.context.env;
    }

    constructor(private context: BotContext) {
    }

    execute(me: PlayerInfo, speed: number, boost: boolean, fire: boolean) {

        const isPred = me.type === 1;

        if (speed === 0) {
            this.down.send(this.env, false);
            this.up.send(this.env, false);
            if (isPred) {
                this.boost.send(this.env, false);
            }
            return;
        }

        let stateToUse = this.up;
        let otherState = this.down;

        if (speed < 0) {
            stateToUse = this.down;
            otherState = this.up;
        }

        otherState.send(this.env, false);
        stateToUse.send(this.env, true);

        if (!fire) {// fire goes before boost
            if (isPred && boost && !this.currentBoostTimeout) {
                this.boost.send(this.env, true);
                this.currentBoostTimeout = this.context.tm.setTimeout(() => {
                    this.boost.send(this.env, false);
                    this.currentBoostTimeout = this.context.tm.setTimeout(() => this.currentBoostTimeout = null, 1000);
                }, 2000);
            }
        }
    }
}