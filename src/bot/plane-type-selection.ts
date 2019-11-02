import { IAirmashEnvironment } from "./airmash/iairmash-environment";
import { StopWatch } from "../helper/timer";
import { TimeoutManager } from "../helper/timeoutManager";

export class PlaneTypeSelection {

    aircraftType: number;

    private waitForHealthAndZeroSpeed(env: IAirmashEnvironment, tm: TimeoutManager): Promise<any> {
        return new Promise((resolve) => {
            tm.setTimeout(async () => {
                const me = env.me();
                if (me.health === 1 && me.speed.x === 0 && me.speed.y === 0) {
                    resolve();
                } else {
                    await this.waitForHealthAndZeroSpeed(env, tm);
                    resolve();
                }
            }, 500);
        });
    }

    private wait(ms: number, tm: TimeoutManager): Promise<any> {
        return new Promise((resolve) =>
            tm.setTimeout(() => resolve(), ms));
    }

    async switch(env: IAirmashEnvironment, tm: TimeoutManager): Promise<any> {
        const sw = new StopWatch();
        sw.start();
        await this.waitForHealthAndZeroSpeed(env, tm);
        const leftMs = 2200 - sw.elapsedMs();
        if (leftMs > 0) {
            await this.wait(leftMs, tm);
        }
        env.selectAircraft(this.aircraftType);
    }
}