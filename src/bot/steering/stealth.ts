import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { SteeringState } from "./steering-state";
import { BotContext } from "../../botContext";

export class Stealth {

    private stealth: SteeringState;
    private stealthTimeout: any;

    private get env(): IAirmashEnvironment {
        return this.context.env;
    }

    constructor(private context: BotContext) {
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

            this.stealthTimeout = this.context.tm.setTimeout(() => {
                this.stealth.send(this.env, false);
                this.stealthTimeout = null;
            }, 500);
        }
    }
}