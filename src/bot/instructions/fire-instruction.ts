import { IInstruction } from "./iinstruction";
import { SteeringInstruction } from "../steering/steering-instruction";

export class FireInstruction implements IInstruction {

    getSteeringInstruction(): SteeringInstruction {
        const result = new SteeringInstruction();
        result.fire = true;
        return result;
    }

}