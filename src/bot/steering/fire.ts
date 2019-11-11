import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { SteeringState } from "./steering-state";
import { PlayerInfo } from "../airmash/player-info";
import { BotContext } from "../../botContext";

export class Fire {

    private fire: SteeringState;
    private special: SteeringState;
    private fireTimeout: any;

    constructor(private context: BotContext) {
        this.fire = new SteeringState('FIRE');
        this.special = new SteeringState('SPECIAL');
    }

    execute(me: PlayerInfo, fire: boolean) {
        if (this.fireTimeout) {
            return;
        }

        const myType = me.type;
        const isTornado = myType === 4;
        const isMohawk = myType === 3;

        let stateToUse = this.fire;
        if (isTornado) {
            stateToUse = this.special;
        }

        // just fire constantly in case of mohawk
        fire = fire || isMohawk;

        if (!fire) {
            stateToUse.send(this.context.env, false);
        } else {
            stateToUse.send(this.context.env, true);

            // in case of mohawk, don't turn it off 
            if (!isMohawk) {
                this.fireTimeout = this.context.tm.setTimeout(() => {
                    stateToUse.send(this.context.env, false);
                    this.fireTimeout = this.context.tm.setTimeout(() => this.fireTimeout = null, 100);
                }, 200);
            }
        }
    }
}