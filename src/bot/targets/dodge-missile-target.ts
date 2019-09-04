import { ITarget } from "./itarget";
import { IInstruction } from "../instructions/iinstruction";
import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { BotCharacter } from "../bot-character";
import { Calculations } from "../calculations";
import { BackOffInstruction } from "../instructions/back-off-instruction";
import { Debug } from "../../helper/debug";

export class DodgeMissileTarget implements ITarget {
    goal = 'dodge';

    private objectToAvoidID: number;
    private distanceToKeep: number;
    // private lastTime: number = 0;

    constructor(private env: IAirmashEnvironment, private character: BotCharacter) {

        const missiles = env.getMissiles().filter(x => x.playerID !== env.myId());
        const otherAircrafts = env.getPlayers().filter(x => x.id !== env.myId());

        let closestObject: {
            distance: number,
            object: any,
            distanceToKeep: number
        };
        const myPos = env.me().pos;
        for (var i = 0; i < missiles.length; i++) {
            const delta = Calculations.getDelta(myPos, missiles[i].pos);
            if (!closestObject || delta.distance < closestObject.distance) {
                closestObject = {
                    object: missiles[i],
                    distance: delta.distance,
                    distanceToKeep: character.missileDistance
                };
            }
        }
        for (var i = 0; i < otherAircrafts.length; i++) {
            const p  = otherAircrafts[i];
            if (p.isHidden || !p.isInView || p.isStealthed) {
                return;
            }
            const delta = Calculations.getDelta(myPos, p.pos);
            if (!closestObject || delta.distance < closestObject.distance) {
                closestObject = {
                    object: p,
                    distance: delta.distance,
                    distanceToKeep: character.otherAircraftDistance
                };
            }
        }

        Debug.addLog('dodge', [closestObject.object.id, closestObject.object.pos, closestObject.distance]);
        if (closestObject && closestObject.distance < closestObject.distanceToKeep) {
            this.objectToAvoidID = closestObject.object.id;
            this.distanceToKeep = closestObject.distanceToKeep;
        }
    }

    isValid(): boolean {
        const obj = this.getObjectToAvoid();

        if (!obj) {
            return false;
        }

        const delta = Calculations.getDelta(this.env.me().pos, obj.pos);
        return delta.distance < this.distanceToKeep;
    }

    private getObjectToAvoid(): any {
        var missile = this.env.getMissile(this.objectToAvoidID);
        if (missile) {
            return missile;
        }
        return this.env.getPlayer(this.objectToAvoidID);
    }

    getInstructions(): IInstruction[] {
        const result = [];

        const obj = this.getObjectToAvoid();
        if (!obj) {
            return result;
        }

        var me = this.env.me();
        // if (Date.now() - this.lastTime > 1000) {
        //     console.log(me.pos, me.rot, obj.pos, obj.rot);
        //     this.lastTime = Date.now();
        // }

        var instruction = new BackOffInstruction(me.pos, me.rot, obj.pos, obj.rot);
        result.push(instruction);

        return result;
    }

    onKill(killerID: number, killedID: number) {
    }


}