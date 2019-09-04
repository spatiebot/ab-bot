import { IInstruction } from "./iinstruction";
import { SteeringInstruction } from "../steering/steering-instruction";

export class BoostInstruction implements IInstruction {
    getSteeringInstruction(): SteeringInstruction {
        const result = new SteeringInstruction();
        result.boost = true;
        return result;
    }

}