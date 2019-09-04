import { ITarget } from "./itarget";
import { GotoLocationInstruction } from "../instructions/goto-location";
import { IInstruction } from "../instructions/iinstruction";
import { Calculations } from "../calculations";
import { GotoLocationConfig } from "../instructions/goto-location-config";
import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { Crate } from "../airmash/crate";
import { PoopState } from "./poop-state";
import { Debug } from "../../helper/debug";

export class CrateTarget implements ITarget {
    private readonly targetID: number;
    private gotoLocationConfig = new GotoLocationConfig();

    goal = "stealCrates";
    
    constructor(private env: IAirmashEnvironment, interactivity: PoopState) {
        if (interactivity.upgradesDroppedTime && Date.now() - interactivity.upgradesDroppedTime < 3000) {
            return;
        }

        const crates = env.getCrates();
        const myPos = env.me().pos;

        let closestCrate;
        let closestDistance;
        for (var i = 0; i < crates.length; i++) {
            const delta = Calculations.getDelta(myPos, crates[i].pos);
            if (!closestCrate || delta.distance < closestDistance) {
                closestCrate = crates[i];
                closestDistance = delta.distance;
            }
        }

        if (closestCrate) {
            this.targetID = closestCrate.id;
            console.log('selected target crate at pos ' + closestCrate.pos.x + ',' + closestCrate.pos.y);
        }
    }

    private getTarget(): Crate {
        if (this.targetID) {
            var crate = this.env.getCrate(this.targetID);
            if (!crate) {
                console.log("Target disappeared");
                return null;
            }
            return crate;
        }
        return null;
    }

    onKill(killerID: number, killedID: number) {
    }

    getInstructions(): IInstruction[] {
        const result = [];

        const target = this.getTarget();
        if (!target) {
            return result;
        }

        const targetPos = target.pos;

        this.gotoLocationConfig.desiredDistanceToTarget = 0;
        this.gotoLocationConfig.targetPos = targetPos;

        var instruction = new GotoLocationInstruction(this.env, null, this.targetID);
        instruction.configure(this.gotoLocationConfig);
        result.push(instruction);

        return result;
    }

    isValid(): boolean {
        return !!this.getTarget();
    }
}