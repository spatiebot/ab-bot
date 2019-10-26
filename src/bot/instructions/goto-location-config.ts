import { Pos } from "../pos";

export class GotoLocationConfig { 
    targetPos: Pos;
    desiredDistanceToTarget: number; 
    shouldFleeFrom: boolean;
    errors = 0;
    needNewPath: boolean;
    flyBackwards: boolean;
}