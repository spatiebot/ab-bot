import { Pos } from "../pos";

export class GotoLocationConfig { 
    targetPos: Pos;
    desiredDistanceToTarget: number; 
    prevTargetPos: Pos;
    path: Pos[];
    lastPathTime: number;
    backwards: boolean;
}