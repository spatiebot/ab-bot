import { ITarget } from "./itarget";
import { Pos } from "../pos";
import { IInstruction } from "../instructions/iinstruction";
import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { Calculations } from "../calculations";
import { GotoLocationTarget } from "./goto-location-target";
import { getPlayersSortedByDistance } from "./get-closest-player";
import { OtherPlayerTarget } from "./other-player-target";
import { BotCharacter } from "../bot-character";
import { DoNothingInstruction } from "../instructions/do-nothing-instruction";

const protectiveDistance = 300;
const blacklist: any = {};
const banThreshold = 4;
const ANNOUNCE_TIMEOUT = 1000 * 60 * 10;
let lastAnnounceTime = 0;

export class ProtectTarget implements ITarget {

    private gotoLocationTarget: GotoLocationTarget;
    private attackTarget: OtherPlayerTarget;

    constructor(private env: IAirmashEnvironment, private character: BotCharacter, private target: Pos | number) {
        const now = Date.now();
        if (!target && now - lastAnnounceTime > ANNOUNCE_TIMEOUT) {
            this.env.sendChat("I'm here to protect. Say '#protect me' to get some extra protection.");
            lastAnnounceTime = now;
        }
    }

    isValid(): boolean {
        if (!this.target) {
            return false;
        }

        if (this.target instanceof Pos) {
            return true;
        }
        if (blacklist[this.target] > banThreshold) {
            return false;
        }

        if (this.gotoLocationTarget) {
            return this.gotoLocationTarget.isValid();
        }
        if (this.attackTarget) {
            return this.attackTarget.isValid();
        }

        return true;
    }

    getInstructions(): IInstruction[] {
        const me = this.env.me();
        let pos: Pos;
        if (this.target instanceof Pos) {
            pos = this.target;
        } else {
            const player = this.env.getPlayer(this.target);
            if (!player) {
                return [new DoNothingInstruction()];
            }
            pos = player.pos;
        }

        this.gotoLocationTarget = null;
        this.attackTarget = null;

        // find enemies
        const enemies = getPlayersSortedByDistance(this.env, true, pos)
            .filter(x => x.player.id !== this.target)
            .filter(x => x.player.team !== me.team)
            .filter(x => !x.player.isHidden && x.player.isInView && !x.player.isStealthed);

        const target = enemies[0];
        if (target && target.delta.distance < protectiveDistance * 3) {
            this.attackTarget = new OtherPlayerTarget(this.env, this.character, [], target.player.id);
            return this.attackTarget.getInstructions();
        }

        const delta = Calculations.getDelta(me.pos, pos);

        if (delta.distance > protectiveDistance) {
            this.gotoLocationTarget = new GotoLocationTarget(this.env, pos);
            return this.gotoLocationTarget.getInstructions();
        }

        return [new DoNothingInstruction()];
    }

    onKill(killerID: number, killedID: number) {
        if (killerID === this.target && killedID === this.env.myId()) {
            let killCount = blacklist[killerID] || 0;
            killCount++;
            blacklist[killerID] = killCount;
        }
        if (killerID === this.env.myId() && killedID === this.target) {
            this.env.sendChat('Oops, sorry!');
        }
    }

    getInfo(): { info: string; id: number; pos: Pos; } {
        if (this.gotoLocationTarget) {
            const info = this.gotoLocationTarget.getInfo();
            info.info = 'protect: goto location to protect';
            return info;
        }
        if (this.attackTarget) {
            const info = this.attackTarget.getInfo();
            info.info = 'protect: ' + info.info;
            return info;
        }

        return {
            id: this.target instanceof Pos ? null : this.target,
            pos: this.target instanceof Pos ? this.target : null,
            info: 'protect target initializing'
        };
    }

    goal = "protect";

}