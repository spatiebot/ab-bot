import { ITarget } from "./itarget";
import { IInstruction } from "../instructions/iinstruction";
import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { Score } from "../airmash/score";
import { PoopState as PoopState } from "./poop-state";
import { PlayerInfo } from "../airmash/player-info";
import { GotoLocationConfig } from "../instructions/goto-location-config";
import { GotoLocationInstruction } from "../instructions/goto-location";
import { Calculations } from "../calculations";

export class DropCratesTarget implements ITarget {
    goal = 'stealCrates';

    private targetID: number;
    private gotoLocationConfig = new GotoLocationConfig();
    private shouldRecycle: boolean;

    constructor(private env: IAirmashEnvironment, private score: Score, private poopState: PoopState) {
        if (poopState.poopyPlayerID) {
            this.targetID = poopState.poopyPlayerID;
            if (!poopState.confirmedPlayerSince) {
                this.poopState.confirmedPlayerSince = Date.now();
                env.sendChat('Roger that!');
                console.log('selected player for pooping: ' + this.targetID);
            }

            if (!this.isValid()) {
                this.poopState.reset();
            }
   
        } else if (score && score.upgrades > 5 && (!this.poopState.openForPoopCommandsSince || this.poopState.openForPoopCommandsTimeout())) {
            // env.sendChat("Upgrade party! Say '#poop me' in the chat to get some.");
            this.poopState.openForPoopCommandsSince = Date.now();
            console.log('started poopparty');
        }

    }

    isValid(): boolean {
        if (!this.targetID) {
            return false;
        }
        
        const hasUpgradesToSpare = this.score && this.score.upgrades > 5;
        const isTimedOut = this.poopState.confirmedPlayerTimeout();
        const hasTarget = !!this.getTarget();

        const isValid = !this.shouldRecycle && hasUpgradesToSpare && !isTimedOut && hasTarget;
        return isValid;
    }

    private getTarget(): PlayerInfo {
        if (!this.targetID) {
            return null;
        }
        const p = this.env.getPlayer(this.targetID);
        if (!p) {
            return null;
        }
        if (p.isStealthed || p.isHidden) {
            return null;
        }
        return p;
    }

    getInstructions(): IInstruction[] {
        const result = [];

        if (!this.isValid()) {
            this.shouldRecycle = true;
            this.poopState.reset();
            return result;
        }

        const target = this.getTarget();
        const targetPos = PlayerInfo.getMostReliablePos(target);

        const delta = Calculations.getDelta(this.env.me().pos, targetPos);
        if (targetPos.isAccurate && delta.distance < 200) {
            // within poopable distance
            this.env.sendSay("pooping delicious upgrades for you!");
            this.env.sendCommand("upgrades", "drop 5");
            this.score.upgrades -= 5;
            console.log('pooped 5 upgrades');
            this.poopState.droppedPoop();
            this.shouldRecycle = true;
        } else {
            this.gotoLocationConfig.desiredDistanceToTarget = 0;
            this.gotoLocationConfig.targetPos = targetPos;

            var instruction = new GotoLocationInstruction(this.env, null, this.targetID);
            instruction.configure(this.gotoLocationConfig);
            result.push(instruction);
        }
        return result;
    }

    onKill(killerID: number, killedID: number) {
    }


}