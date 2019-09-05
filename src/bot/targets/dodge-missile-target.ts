import { ITarget } from "./itarget";
import { IInstruction } from "../instructions/iinstruction";
import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { BotCharacter } from "../bot-character";
import { Calculations } from "../calculations";
import { BackOffInstruction } from "../instructions/back-off-instruction";
import { Debug } from "../../helper/debug";

export class DodgeMissileTarget implements ITarget {
    goal = 'dodge';

    objectToAvoidID: number;
    private distanceToKeep: number;

    constructor(private env: IAirmashEnvironment, private character: BotCharacter) {

        const allMissiles = env.getMissiles();
        const missiles = allMissiles.filter(x => !x.playerID || x.playerID !== env.myId());
        const otherAircrafts = env.getPlayers().filter(x => x.id !== env.myId());

        let closestObject: {
            distance: number,
            object: any,
            distanceToKeep: number,
            isMissile: boolean;
        };
        const myPos = env.me().pos;
        for (var i = 0; i < missiles.length; i++) {
            const delta = Calculations.getDelta(myPos, missiles[i].pos);
            if (!closestObject || delta.distance < closestObject.distance) {
                closestObject = {
                    object: missiles[i],
                    distance: delta.distance,
                    distanceToKeep: character.missileDistance,
                    isMissile: true,
                };
            }
        }
        for (var i = 0; i < otherAircrafts.length; i++) {
            const p = otherAircrafts[i];
            if (p.isHidden || !p.isInView || p.isStealthed) {
                continue;
            }
            const delta = Calculations.getDelta(myPos, p.pos);
            if (!closestObject || delta.distance < closestObject.distance) {
                closestObject = {
                    object: p,
                    distance: delta.distance,
                    distanceToKeep: character.otherAircraftDistance,
                    isMissile: false
                };
            }
        }

        if (closestObject) {
            if (closestObject.distance < closestObject.distanceToKeep) {
                this.objectToAvoidID = closestObject.object.id;
                this.distanceToKeep = closestObject.distanceToKeep;
            }
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

        var instruction = new BackOffInstruction(me.pos, me.rot, obj.pos, obj.rot);
        result.push(instruction);

        return result;
    }

    onKill(killerID: number, killedID: number) {
    }


}