import { ITarget } from "./itarget";
import { IInstruction } from "../instructions/iinstruction";
import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { BotCharacter } from "../bot-character";
import { getClosestPlayer } from "./get-closest-player";
import { AvoidObjectInstruction } from "../instructions/avoid-object-instruction";

export class FleeTarget implements ITarget {
    goal = 'flee';

    constructor(private env: IAirmashEnvironment, private character: BotCharacter) {
    }

    isValid(): boolean {
        return this.env.me().health < this.character.fleeHealth;
    }

    getInstructions(): IInstruction[] {
        // find the closest aircraft and flee from it
        const closest = getClosestPlayer(this.env);
        const me = this.env.me();
        const instr = new AvoidObjectInstruction(me.pos, me.rot, closest.player.pos, closest.player.rot);;
        return [instr];
    }

    onKill(killerID: number, killedID: number) {
    }


}