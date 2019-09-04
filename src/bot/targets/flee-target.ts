import { ITarget } from "./itarget";
import { IInstruction } from "../instructions/iinstruction";
import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { BotCharacter } from "../bot-character";
import { getClosestPlayer } from "./get-closest-player";
import { BackOffInstruction } from "../instructions/back-off-instruction";

export class FleeTarget implements ITarget {
    goal = 'flee';

    private static lastTime = 0;

    constructor(private env: IAirmashEnvironment, private character: BotCharacter) {
    }

    isValid(): boolean {
        if (Date.now() - FleeTarget.lastTime > 1000) {
            FleeTarget.lastTime = Date.now();
        }

        return this.env.me().health < this.character.fleeHealth;
    }

    getInstructions(): IInstruction[] {
        // find the closest aircraft and flee from it
        const closest = getClosestPlayer(this.env);
        const me = this.env.me();
        const instr = new BackOffInstruction(me.pos, me.rot, closest.player.pos, closest.player.rot);;
        return [instr];
    }

    onKill(killerID: number, killedID: number) {
    }


}