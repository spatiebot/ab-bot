import { Pos } from "../pos";
import { StopWatch } from "../../helper/timer";
import { Calculations } from "../calculations";

const PATH_FINDING_LOWER_LIMIT_MS = 100;
const PATH_FINDING_UPPER_LIMIT_MS = 800;
const MAX_SPEED_PER_MS = 1;

const caches = {};

export class GotoLocationConfig {
    private readonly id: number;

    constructor(botId: number) {
        this.id = botId;
        caches[this.id] = caches[this.id] || {
            sw: new StopWatch(),
            lastPath: [],
            throttleMs: 0,
        };
    }

    private get myThrottleTimer(): StopWatch {
        return caches[this.id].sw;
    }

    private get myThrottleMs(): number {
        return caches[this.id].throttleMs;
    }
    private set myThrottleMs(value: number) {
        caches[this.id].throttleMs = value;
    }

    get lastPath(): Pos[] {
        return caches[this.id].lastPath;
    }
    set lastPath(value: Pos[]) {
        caches[this.id].lastPath = value;
    }

    setLastPath(path: Pos[]) {
        this.myThrottleTimer.start();
        this.lastPath = path;

        if (path && path.length > 1) {
            const myPos = path[0];
            const firstPos = path[1];

            const diff = Calculations.getDelta(myPos, firstPos);
            if (diff) {
                this.myThrottleMs = diff.distance / MAX_SPEED_PER_MS;
            }
        }
    }

    shouldCalculatePath(): boolean {
        if (!this.lastPath || this.lastPath.length < 2) {
            return true;
        }
        const timeoutMs = Math.min(Math.max(this.myThrottleMs, PATH_FINDING_LOWER_LIMIT_MS), PATH_FINDING_UPPER_LIMIT_MS);
        return this.myThrottleTimer.elapsedMs() > timeoutMs;
    } 

    targetPos: Pos;
    desiredDistanceToTarget: number; 
    shouldFleeFrom: boolean;
    errors = 0;
    flyBackwards: boolean;
}