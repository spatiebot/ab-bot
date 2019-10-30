import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { SteeringInstruction } from "./steering-instruction";
import { Rotate } from "./rotate";
import { Speed } from "./speed";
import { Fire } from "./fire";
import { Fart } from "./fart";
import { Stealth } from "./stealth";
import { Logger } from "../../helper/logger";
import { StopWatch } from "../../helper/timer";

export const STEERING_INTERVAL = 180;
export const LONG_STEERING_INTERVAL = 3.5 * STEERING_INTERVAL;

function isNullOrUndefined(obj: any): boolean {
    return obj === null || typeof (obj) === 'undefined';
}

export class SteeringInstallation {

    private instructions: SteeringInstruction[] = [];

    private rotation: Rotate;
    private speed: Speed;
    private fire: Fire;
    private fart: Fart;
    private stealth: Stealth;
    private isStarted: boolean;
    private executionTimer = new StopWatch();
    private isExecuting: boolean;

    constructor(private env: IAirmashEnvironment, private logger: Logger) {
        this.rotation = new Rotate(env);
        this.speed = new Speed(env);
        this.fire = new Fire(env);
        this.fart = new Fart(env);
        this.stealth = new Stealth(env);
    
        this.executionTimer.start();
    }

    start() {
        this.isStarted = true;
    }

    stop() {
        this.isStarted = false;
        this.instructions = [];
    }

    reset() {
        this.stop();
        this.start();
    }

    add(instruction: SteeringInstruction) {
        this.instructions.push(instruction);
    }

    stopAllSteering() {
        this.stop();
        this.env.sendKey('FIRE', false);
        this.env.sendKey('LEFT', false);
        this.env.sendKey('RIGHT', false);
        this.env.sendKey('UP', false);
        this.env.sendKey('DOWN', false);
        this.env.sendKey('SPECIAL', false);
    }

    executeWhenReady() {
        if (!this.isStarted) {
            return;
        }
        if (this.isExecuting) {
            this.logger.warn("Steeringinterval started twice!");
            return;
        }

        if (this.executionTimer.elapsedMs() < STEERING_INTERVAL) {
            return;
        }
        this.isExecuting = true;

        try {

            const instruction = this.compress(this.instructions);
            this.instructions = [];

            const me = this.env.me();

            this.rotation.execute(me, instruction.rotDelta);
            this.speed.execute(me, instruction.targetSpeed, instruction.boost, instruction.fire);
            this.stealth.execute(instruction.stealth);
            this.fart.execute(instruction.fart);
            this.fire.execute(me, instruction.fire);

        } finally {
            this.executionTimer.start();
            this.isExecuting = false;
        }
    }

    private compress(instructions: SteeringInstruction[]): SteeringInstruction {
        const result = new SteeringInstruction();

        for (const instr of instructions) {
            result.targetSpeed = !isNullOrUndefined(instr.targetSpeed) ? instr.targetSpeed : result.targetSpeed;
            result.rotDelta = !isNullOrUndefined(instr.rotDelta) ? instr.rotDelta : result.rotDelta;
            result.fire = instr.fire || instr.fire;
            result.boost = result.boost || instr.boost;
            result.fart = instr.fart || instr.fart;
            result.stealth = instr.stealth || instr.stealth;
        }

        return result;
    }
}