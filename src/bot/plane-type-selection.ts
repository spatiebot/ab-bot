import { IAirmashEnvironment } from "./airmash/iairmash-environment";
import { StopWatch } from "../helper/timer";

export class PlaneTypeSelection {

    aircraftType: number;

    private waitForHealthAndZeroSpeed(env: IAirmashEnvironment): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(async () => {
                const me = env.me();
                if (me.health === 1 && me.speed.x === 0 && me.speed.y === 0) {
                    resolve();
                } else {
                    await this.waitForHealthAndZeroSpeed(env);
                    resolve();
                }
            }, 500);
        });
    }

    private wait(ms: number): Promise<any> {
        return new Promise((resolve) => 
            setTimeout(() => resolve(), ms));
    }

    async switch(env: IAirmashEnvironment): Promise<any> {
        const sw = new StopWatch();
        sw.start();
        await this.waitForHealthAndZeroSpeed(env);
        const leftMs = 2200 - sw.elapsedMs();
        if (leftMs > 0) {
            await this.wait(leftMs);
        }
        env.selectAircraft(this.aircraftType);
    }
}