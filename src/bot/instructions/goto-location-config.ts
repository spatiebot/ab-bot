import { Pos } from "../pos";
import { StopWatch } from "../../helper/timer";

export class GotoLocationConfig {
    
    setLastPath(path: Pos[], msItTook: number) {
        this.lastPathFindingMs = msItTook;
        this.timeoutUntilNextPathFindingStopWatch.start();
        this.lastPath = path;
    }

    shouldCalculatePath(): boolean {
        if (this.needNewPath) {
            return true;
        }
        const timeoutMs = Math.max(this.lastPathFindingMs, 200);
        return !this.lastPath || this.timeoutUntilNextPathFindingStopWatch.elapsedMs() > timeoutMs;
    } 

    targetPos: Pos;
    desiredDistanceToTarget: number; 
    shouldFleeFrom: boolean;
    errors = 0;
    needNewPath: boolean;
    flyBackwards: boolean;
    timeoutUntilNextPathFindingStopWatch = new StopWatch();
    lastPathFindingMs: number = 0;
    lastPath: Pos[];
}