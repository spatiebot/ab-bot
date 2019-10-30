import { IInstruction } from "../instructions/iinstruction";
import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { BotCharacter } from "../bot-character";
import { Calculations } from "../calculations";
import { AvoidObjectInstruction } from "../instructions/avoid-object-instruction";
import { Missile } from "../airmash/missile";
import { FartInstruction } from "../instructions/fart-instruction";
import { BaseTarget } from "./base-target";
import { MissileHelper } from "../../helper/missilehelper";

export class DodgeMissileTarget extends BaseTarget {
    goal = 'dodge';

    private missileToAvoidId: number;

    constructor(private env: IAirmashEnvironment, private character: BotCharacter, private blacklist: number[]) {
        super();

        const hostileMissiles = MissileHelper.getHostileMissiles(this.env)
            .filter(x => blacklist.indexOf(x.id) === -1);

        let closestObject: {
            distance: number;
            object: Missile;
        };
        const myPos = env.me().pos;
        for (let i = 0; i < hostileMissiles.length; i++) {
            const delta = Calculations.getDelta(myPos, hostileMissiles[i].pos);
            if (!closestObject || delta.distance < closestObject.distance) {
                closestObject = {
                    object: hostileMissiles[i],
                    distance: delta.distance
                };
            }
        }

        if (closestObject) {
            const distanceToKeep = this.getDistanceToKeep();

            if (closestObject.distance < distanceToKeep) {
                this.missileToAvoidId = closestObject.object.id;
            }
        }
    }

    private getDistanceToKeep(): number {
        const me = this.env.me();
        const myHealth = me.health;
        const healthAnxiety = myHealth <= this.character.fleeHealth ? 20 : 1;
        const healthFactor = (myHealth > 0 ? 1 / myHealth : 2) / 2;

        return this.character.missileDistance * healthFactor * healthAnxiety;
    }

    isValid(): boolean {
        const obj = this.getMissileToAvoid();

        if (!obj) {
            return false;
        }

        const delta = Calculations.getDelta(this.env.me().pos, obj.pos);
        return delta.distance < this.getDistanceToKeep();
    }

    private getMissileToAvoid(): Missile {
        const missile = this.env.getMissile(this.missileToAvoidId);
        return missile;
    }

    getInfo() {
        const missile = this.getMissileToAvoid();
        return {
            info: 'avoid missile',
            id: this.missileToAvoidId,
            pos: missile ? missile.pos : null
        };
    }

    getInstructions(): IInstruction[] {
        const result = [];

        const missile = this.getMissileToAvoid();
        if (!missile) {
            return result;
        }

        const me = this.env.me();

        if (!missile.rot && missile.rot !== 0) {
            let rot = Math.atan2(missile.speed.y, missile.speed.x) + (Math.PI / 2);
            if (rot < 0) {
                rot += Math.PI * 2;
            }
            missile.rot = rot;
        }

        const delta = Calculations.getDelta(me.pos, missile.pos);

        let instruction: IInstruction;
        if (me.energy > 0.5 && me.type === 2 && delta.distance < 200) {
            // goliath can fart
            instruction = new FartInstruction();
        } else {
            instruction = new AvoidObjectInstruction(me.pos, me.rot, missile.pos, missile.rot);
        }
        result.push(instruction);

        return result;
    }

    onKill(killerID: number, killedID: number) {
    }


}