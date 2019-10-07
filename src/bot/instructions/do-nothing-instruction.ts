import { IInstruction } from "./iinstruction";
import { SteeringInstruction } from "../steering/steering-instruction";

export class DoNothingInstruction implements IInstruction {
    getSteeringInstruction(): Promise<SteeringInstruction> {
        return Promise.resolve({
            boost: false,
            fart: false,
            fire: false,
            rotDelta: 0,
            targetSpeed: 0,
            stealth: false,
        });
    }
}