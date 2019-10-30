import { PlayerInfo } from "../airmash/player-info";
import { GotoLocationInstruction } from "../instructions/goto-location";
import { IInstruction } from "../instructions/iinstruction";
import { Calculations } from "../calculations";
import { FireInstruction } from "../instructions/fire-instruction";
import { BotCharacter } from "../bot-character";
import { Pos } from "../pos";
import { GotoLocationConfig } from "../instructions/goto-location-config";
import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { getPlayersSortedByDistance } from "./get-closest-player";
import { BaseTarget } from "./base-target";
import { Logger } from "../../helper/logger";

export class OtherPlayerTarget extends BaseTarget {

    private readonly targetID: number;
    private shouldRecycle: boolean;
    private gotoLocationConfig: GotoLocationConfig;
    private manualInfo: string;
    private maxDistance: number;

    goal = "fight";

    constructor(private env: IAirmashEnvironment, private logger: Logger, private character: BotCharacter, blacklist: number[], victimId: number = null, private peaceful = false) {
        super();
        this.gotoLocationConfig = new GotoLocationConfig(env.myId());

        let victim: PlayerInfo;
        const me = env.me();

        if (victimId) {
            victim = env.getPlayer(victimId);
        } else {
            const enemies = getPlayersSortedByDistance(env, true)
                .filter(x => x.player.team !== me.team)
                .filter(x => blacklist.indexOf(x.player.id) === -1)
                .filter(x => this.isTargetValid(x.player));

            const withinRange = enemies.filter(x => x.delta.distance < character.firingRange);
            if (withinRange.length > 0) {
                withinRange.sort((a, b) => {
                    if (a.player.health < b.player.health) {
                        return -1;
                    } else if (a.player.health > b.player.health) {
                        return 1;
                    }
                    return 0;
                });
                victim = withinRange[0].player;
            }

            if (enemies.length > 0) {
                victim = victim || enemies[0].player;
            }
        }

        if (victim) {
            this.targetID = victim.id;
        }
    }

    setMaxDistance(max: number) {
        this.maxDistance = max;
    }

    getInfo() {
        const enemy = this.getTarget();
        if (!enemy) {
            return {
                info: 'enemy disappeared',
                id: this.targetID,
                pos: null
            };
        }
        return {
            info: (this.manualInfo || "") + (this.peaceful ? ' goto ' : ' attack ') + enemy.name,
            id: this.targetID,
            pos: enemy.pos
        };
    }

    setInfo(info: string) {
        this.manualInfo = info;
    }

    private getTarget(): PlayerInfo {
        if (this.targetID) {
            const p = this.env.getPlayer(this.targetID);
            return p;
        }
        return null;
    }

    onKill(killerID: number, killedID: number) {
        if (this.targetID === killedID) {
            this.shouldRecycle = true;
        }
        if (this.env.me().id === killedID) {
            this.shouldRecycle = true;
        }
    }

    getInstructions(): IInstruction[] {
        const result = [];

        const targetPos = this.getTargetPos(this.character.predictPositions);
        if (!targetPos) {
            return result;
        }

        this.gotoLocationConfig.desiredDistanceToTarget = this.character.intimateRange;
        this.gotoLocationConfig.targetPos = targetPos;

        const instruction = new GotoLocationInstruction(this.env, this.logger, this.character, this.targetID);
        instruction.configure(this.gotoLocationConfig);
        result.push(instruction);

        if (!this.peaceful) {
            const me = this.env.me();
            const delta = Calculations.getDelta(me.pos, targetPos);
            if (delta) {
                if (delta.distance < this.character.firingRange) {
                    result.push(new FireInstruction());
                }
            }
        }

        return result;
    }

    private getTargetPos(predictPositions: boolean): Pos {
        const t = this.getTarget();
        if (t) {
            let pos = PlayerInfo.getMostReliablePos(t);

            if (predictPositions && pos.isAccurate) {
                pos = Calculations.predictPosition(this.env.getPing(), pos, t.speed);
            }

            return pos;
        }
        return null;
    }

    private isTargetValid(t: PlayerInfo) {
        return t && !t.isStealthed && !t.isHidden && !t.hasInferno && !t.hasShield;
    }

    isValid(): boolean {
        if (this.shouldRecycle) {
            return false;
        }

        const target = this.getTarget();
        if (!this.isTargetValid(target)) {
            return false;
        }

        if (this.maxDistance) {
            const distance = Calculations.getDelta(this.env.me().pos, target.pos).distance;
            return distance < this.maxDistance;
        }

        return true;
    }
}