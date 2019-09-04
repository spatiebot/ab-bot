import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { SteeringState } from "./steering-state";
import { PlayerInfo } from "../airmash/player-info";

export class Fire {

    private fire: SteeringState;
    private special: SteeringState;
    private fireTimeout: any;

    constructor(private env: IAirmashEnvironment) {
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
            stateToUse.send(this.env, false);
        } else {
            stateToUse.send(this.env, true);

            // in case of mohawk, don't turn it off, 
            // but send a new command each second or so
            // to keep firing
            if (!isMohawk) {
                this.fireTimeout = setTimeout(() => {
                    stateToUse.send(this.env, false);
                    this.fireTimeout = setTimeout(() => this.fireTimeout = null, 100);
                }, 50);
            }
        }
    }
}