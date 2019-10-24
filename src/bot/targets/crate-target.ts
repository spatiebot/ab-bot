import { ITarget } from "./itarget";
import { GotoLocationInstruction } from "../instructions/goto-location";
import { IInstruction } from "../instructions/iinstruction";
import { Calculations } from "../calculations";
import { GotoLocationConfig } from "../instructions/goto-location-config";
import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { Crate } from "../airmash/crate";
import logger = require("../../helper/logger");
import { BaseTarget } from "./base-target";

export class CrateTarget extends BaseTarget {
    private readonly targetID: number;
    private gotoLocationConfig = new GotoLocationConfig();

    distance: number;
    goal = "stealCrates";

    constructor(private env: IAirmashEnvironment, blacklist: number[]) {
        super();
        const crates = env.getCrates().filter(x => blacklist.indexOf(x.id) === -1);
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
            this.distance = closestDistance;
        }
    }

    private getTarget(): Crate {
        if (this.targetID) {
            var crate = this.env.getCrate(this.targetID);
            if (!crate) {
                return null;
            }
            return crate;
        }
        return null;
    }

    onKill(killerID: number, killedID: number) {
    }

    getInfo() {
        const crate = this.getTarget();
        if (!crate) {
            return {
                info: 'crate disappeared',
                id: this.targetID,
                pos: null
            };
        }

        return {
            info: 'crate at pos ' + crate.pos.x + ',' + crate.pos.y,
            id: this.targetID,
            pos: crate.pos
        };
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