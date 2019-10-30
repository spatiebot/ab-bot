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
import { BaseTarget } from "./base-target";
import { PlayerInfo } from "../airmash/player-info";
import { FlagHelpers } from "../../helper/flaghelpers";
import { Logger } from "../../helper/logger";

const blacklist: any = {};
const banThreshold = 4;
const ANNOUNCE_TIMEOUT = 1000 * 60 * 10;
let lastAnnounceTime = 0;

export class ProtectTarget extends BaseTarget {

    private innerTarget: ITarget;
    private target: Pos | number;
    private manualInfo: string;
    private isInvalid = false;

    constructor(private env: IAirmashEnvironment, private logger: Logger, private character: BotCharacter, target: Pos | number, private distance: number) {
        super();

        const now = Date.now();
        if (!target && now - lastAnnounceTime > ANNOUNCE_TIMEOUT && this.env.getGameType() === 1) {
            this.env.sendChat("I'm here to protect. Say '#protect me' to get some extra protection.");
            lastAnnounceTime = now;
        }

        if (typeof target === 'number') {
            this.target = target;
        } else {
            this.target = new Pos(target);
        }

        this.determineInnerTarget();
    }

    isValid(): boolean {
        if (this.isInvalid) {
            return false;
        }

        if (!this.target) {
            return false;
        }

        if (this.target instanceof Pos) {
            return true;
        }
        if (blacklist[this.target] > banThreshold) {
            return false;
        }

        const player = this.env.getPlayer(this.target);
        if (!player || player.isHidden) {
            return false;
        }

        if (FlagHelpers.isCarryingFlag(this.env)) {

            return false;
        }

        this.determineInnerTarget();

        if (this.innerTarget) {
            return this.innerTarget.isValid();
        }

        return true;
    }

    private determineInnerTarget() {
        const me = this.env.me();
        let pos: Pos;
        let otherPlayer: PlayerInfo;

        const logPrefix = (this.manualInfo || "protect");

        const log = (x: string, ...args: any[]) => this.isActive && this.logger.info(x, ...args);

        if (this.target instanceof Pos) {
            pos = this.target;
        } else {
            otherPlayer = this.env.getPlayer(this.target);
            if (otherPlayer) {
                pos = otherPlayer.pos;
            } else {
                this.isInvalid = true;
                this.innerTarget = null;
                log(logPrefix + " target invalidated");
                return;
            }
        }

        // find enemies, even prowlers
        const enemies = getPlayersSortedByDistance(this.env, true, pos)
            .filter(x => x.player.id !== this.target)
            .filter(x => x.player.team !== me.team)
            .filter(x => x.player.name.indexOf('BrexitBot') === -1)
            .filter(x => !x.player.isHidden && x.player.isInView);

        const enemy = enemies[0];
        if (enemy && enemy.delta.distance < this.distance * 3) {
            const newTarget = new OtherPlayerTarget(this.env, this.logger, this.character, [], enemy.player.id);
            if (!newTarget.equals(this.innerTarget)) {
                log(logPrefix + " has new attack otherplayer target: " + newTarget.getInfo().info);

                this.innerTarget = newTarget;
            }
            return;
        }

        const delta = Calculations.getDelta(me.pos, pos);

        if (delta.distance > this.distance) {

            if (otherPlayer) {
                const newTarget = new OtherPlayerTarget(this.env, this.logger, this.character, [], otherPlayer.id, true);
                if (!newTarget.equals(this.innerTarget)) {
                    log(logPrefix + " has new defend other player target: " + newTarget.getInfo().info);
                }
                this.innerTarget = newTarget;

                return;
            } else {
                const newTarget = new GotoLocationTarget(this.env, this.logger, pos);
                if (!newTarget.equals(this.innerTarget)) {
                    log(logPrefix + " has new goto location target: " + newTarget.getInfo().info);
                    this.innerTarget = newTarget;
                }
                return;
            }
        }

        if (this.innerTarget) {
            log(logPrefix + " innertarget reset");
        }
        this.innerTarget = null
    }

    getInstructions(): IInstruction[] {
        this.determineInnerTarget();

        if (this.innerTarget) {
            return this.innerTarget.getInstructions();
        }

        return [new DoNothingInstruction()];
    }

    onKill(killerID: number, killedID: number) {
        if (killerID === this.target && killedID === this.env.myId()) {
            let killCount = blacklist[killerID] || 0;
            killCount++;
            blacklist[killerID] = killCount;
        }
    }

    setInfo(info: string) {
        this.manualInfo = info;
    }

    getInfo(): { info: string; id: number; pos: Pos } {

        const prefix = this.manualInfo || "protect";
        if (this.target instanceof Pos) {
            const pos = this.target;
            return {
                id: null,
                pos,
                info: prefix + " fixed location " + pos.x + "," + pos.y
            };
        } else {
            return {
                id: this.target as number,
                pos: null,
                info: prefix + " player " + this.target
            };
        }
    }

    goal = "protect";
}