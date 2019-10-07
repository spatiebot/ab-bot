import { IInstruction } from "./iinstruction";
import { SteeringInstruction } from "../steering/steering-instruction";

export class FartInstruction implements IInstruction {
    getSteeringInstruction(): Promise<SteeringInstruction> {
        const result = new SteeringInstruction();
        result.fart = true;
        return Promise.resolve(result);
    }

}