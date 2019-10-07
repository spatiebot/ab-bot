import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { SteeringState } from "./steering-state";

export class Fart {

    private fart: SteeringState;
    private fartTimeout: any;

    constructor(private env: IAirmashEnvironment) {
        this.fart = new SteeringState('SPECIAL');
    }

    execute(fart: boolean) {
        if (this.fartTimeout) {
            return;
        }
        if (this.env.me().type !== 2) {
            return;
        }

        if (!fart) {
            this.fart.send(this.env, false);
        } else {
            this.fart.send(this.env, true);
        }
    }
}