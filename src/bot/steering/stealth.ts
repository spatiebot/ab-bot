import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { SteeringState } from "./steering-state";

export class Stealth {

    private stealth: SteeringState;
    private stealthTimeout: any;

    constructor(private env: IAirmashEnvironment) {
        this.stealth = new SteeringState('SPECIAL');
    }

    execute(stealth: boolean) {
        if (this.stealthTimeout) {
            return;
        }
        if (this.env.me().type !== 5) {
            return;
        }

        if (!stealth) {
            this.stealth.send(this.env, false);
        } else {
            this.stealth.send(this.env, true);

            this.stealthTimeout = setTimeout(() => {
                this.stealth.send(this.env, false);
                this.stealthTimeout = null;
            }, 500);
        }
    }
}