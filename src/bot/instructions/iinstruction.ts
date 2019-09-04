import { SteeringInstruction } from "../steering/steering-instruction";

export interface IInstruction {
    getSteeringInstruction(): SteeringInstruction;
}