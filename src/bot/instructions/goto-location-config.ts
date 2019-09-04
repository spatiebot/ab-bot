import { Pos } from "../pos";

export class GotoLocationConfig { 
    targetPos: Pos;
    desiredDistanceToTarget: number; 
    prevTargetPos: Pos;
    path: Pos[];
    pathFindingFailures: number = 0;
    lastPathTime: number;
    backwards: boolean;
}