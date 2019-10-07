import { IInstruction } from "./iinstruction";
import { SteeringInstruction } from "../steering/steering-instruction";
import { Pos } from "../pos";
import { Calculations } from "../calculations";

export class AvoidObjectInstruction implements IInstruction {
    // private lastTime: number = 0;

    constructor(private myPos: Pos, private myRot: number, private objectPos, private objectRot) {

    }

    getSteeringInstruction(): Promise<SteeringInstruction> {

        let perpendicular = this.objectRot + .5 * Math.PI;
        const objectToMeAngle = Calculations.getTargetRotation(this.objectPos, this.myPos);

        if (objectToMeAngle < this.objectRot) {
            perpendicular = perpendicular + Math.PI;
        }

        if (perpendicular > Math.PI * 2) {
            perpendicular -= Math.PI * 2;
        }

        // to flee from the object, go into the direction of the perpendicular.
        // turning is slow, so fly backwards or forwards if needed.
        const rotDiff = Calculations.getAngleDiff(this.myRot, perpendicular);
        const diffSign = rotDiff === 0 ? 1 : rotDiff / Math.abs(rotDiff);
        const backwardsRotDiff = (Math.PI - Math.abs(rotDiff)) * -diffSign;

        const instruction = new SteeringInstruction();
        if (Math.abs(backwardsRotDiff) < Math.abs(rotDiff)) {
            instruction.targetSpeed = -1;
            instruction.rotDelta = backwardsRotDiff;
        } else {
            instruction.targetSpeed = 1;
            instruction.rotDelta = rotDiff;
        }

        instruction.boost = true;
        return Promise.resolve(instruction);
    }

}