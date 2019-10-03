import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { SteeringInstruction } from "./steering-instruction";
import { Rotate } from "./rotate";
import { Speed } from "./speed";
import { Fire } from "./fire";

export const steeringInstallationIntervalMs = 180;
export const longThrottleInterval = 3.5 * steeringInstallationIntervalMs;

function isNullOrUndefined(obj: any): boolean {
    return obj === null || typeof(obj) === 'undefined';
}

export class SteeringInstallation {

    private instructions: SteeringInstruction[] = [];
    private steeringInterval: any;
    
    private rotation: Rotate;
    private speed: Speed;
    private fire: Fire;

    constructor(private env: IAirmashEnvironment) {
        this.rotation = new Rotate(env);
        this.speed = new Speed(env);
        this.fire = new Fire(env);
    }

    start() {
        if (this.steeringInterval) {
            return;
        }
        this.steeringInterval = setInterval(() => this.execute(), steeringInstallationIntervalMs);
    }

    stop() {
        clearInterval(this.steeringInterval);
        this.steeringInterval = null;
    }

    add(instruction: SteeringInstruction) {
        this.instructions.push(instruction);
    }

    private execute() {
        const instruction = this.compress(this.instructions);
        this.instructions = [];

        const me = this.env.me();

        this.rotation.execute(me, instruction.rotDelta);
        this.speed.execute(me, instruction.targetSpeed, instruction.boost, instruction.fire);
        this.fire.execute(me, instruction.fire);
    }

    private compress(instructions: SteeringInstruction[]): SteeringInstruction {
        const result = new SteeringInstruction();

        for (const instr of instructions) {
            result.targetSpeed = !isNullOrUndefined(instr.targetSpeed) ? instr.targetSpeed : result.targetSpeed;
            result.rotDelta = !isNullOrUndefined(instr.rotDelta) ? instr.rotDelta : result.rotDelta;
            result.fire = instr.fire || instr.fire;
            result.boost = result.boost || instr.boost;
            result.fart = instr.fart || instr.fart;
            result.fireThree = instr.fireThree || instr.fireThree;
        }

        return result;
    }


    
}