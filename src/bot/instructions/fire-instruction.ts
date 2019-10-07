import { IInstruction } from "./iinstruction";
import { SteeringInstruction } from "../steering/steering-instruction";

export class FireInstruction implements IInstruction {

    getSteeringInstruction(): Promise<SteeringInstruction> {
        const result = new SteeringInstruction();
        result.fire = true;
        return Promise.resolve(result);
    }

}