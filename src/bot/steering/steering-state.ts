import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { steeringInstallationIntervalMs, longThrottleInterval } from "./steering-installation";

export class SteeringState {
    private sent: number = Date.now();
    private lastValue: any;
    
    constructor(private readonly key: string) {
    }

    canSend(): boolean {
        return (Date.now() > this.sent + steeringInstallationIntervalMs);
    }

    send(env: IAirmashEnvironment, value: boolean) {
        var keystate = env.getMyKeyState();
        if (keystate[this.key] === value) {
            return;
        }        

        const timeOut = this.sent + longThrottleInterval;
        const hasTimedOut = Date.now() > timeOut;
        if (this.lastValue === value && !hasTimedOut) {
            return;
        }

        env.sendKey(this.key, !!value);
        this.sent = Date.now();
        this.lastValue = value;
    }
}
