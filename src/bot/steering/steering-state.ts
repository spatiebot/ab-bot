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
        if (this.lastValue === value && Date.now() < this.sent + longThrottleInterval) {
            return;
        }
        env.sendKey(this.key, !!value);
        this.sent = Date.now();
        this.lastValue = value;
    }
}
