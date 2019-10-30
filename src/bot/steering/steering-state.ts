import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { STEERING_INTERVAL, LONG_STEERING_INTERVAL } from "./steering-installation";

export class SteeringState {
    private sent: number = Date.now();
    private lastValue: any;
    
    constructor(private readonly key: string) {
    }

    canSend(): boolean {
        return (Date.now() > this.sent + STEERING_INTERVAL);
    }

    send(env: IAirmashEnvironment, value: boolean) {
        const keystate = env.getMyKeyState();
        if (keystate[this.key] === value && this.key !== 'SPECIAL' && this.key !== 'FIRE') {
            return;
        }        

        const timeOut = this.sent + LONG_STEERING_INTERVAL;
        const hasTimedOut = Date.now() > timeOut;
        if (this.lastValue === value && !hasTimedOut) {
            return;
        }

        env.sendKey(this.key, !!value);
        this.sent = Date.now();
        this.lastValue = value;
    }
}
