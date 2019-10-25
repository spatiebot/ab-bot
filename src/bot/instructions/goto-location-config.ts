import { Pos } from "../pos";

export class GotoLocationConfig { 
    targetPos: Pos;
    desiredDistanceToTarget: number; 
    backwards: boolean;
    errors = 0;
    needNewPath: boolean;
}