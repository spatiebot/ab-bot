import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { SteeringState } from "./steering-state";

export class Stealth {

    private stealth: SteeringState;
    private stealthTimeout: any;

    constructor(private env: IAirmashEnvironment) {
        this.stealth = new SteeringState('SPECIAL');
    }

    execute(fart: boolean) {
        if (this.stealthTimeout) {
            return;
        }

        if (!fart) {
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