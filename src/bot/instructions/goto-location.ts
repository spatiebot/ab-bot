import { IInstruction } from "./iinstruction";
import { SteeringInstruction } from "../steering/steering-instruction";
import { Calculations } from "../calculations";
import { BotCharacter } from "../bot-character";
import { GotoLocationConfig } from "./goto-location-config";
import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { PlayerInfo } from "../airmash/player-info";
import { Pos } from "../pos";
import { PathFinding } from "./path-finding";

export class GotoLocationInstruction implements IInstruction {

    private config: GotoLocationConfig;

    constructor(private env: IAirmashEnvironment, private character: BotCharacter, private targetPlayerId = null) {
    }

    private getNextPos(me: PlayerInfo, shouldCalcPath: boolean) {
        // prevent one-time inaccurate readings to disturb the path
        const isDisturbingPos = this.config.prevTargetPos && this.config.prevTargetPos.isAccurate && !this.config.targetPos.isAccurate;
        shouldCalcPath = shouldCalcPath && !isDisturbingPos;

        if (!shouldCalcPath) {
            if (this.config.path) {
                return this.getMostProbablePosFromPath(1, me.pos);
            }
            return null;
        }

        const players = this.env.getPlayers().filter(x=> x.id !== me.id && x.id !== this.targetPlayerId);
        const pathFinding = new PathFinding(this.env.getWalls(), this.env.getMissiles(), players);

        let myPos = me.pos;
        if (this.character && this.character.predictPositions) {
            myPos = Calculations.predictPosition(100, myPos, me.speed);
        }
        var path = pathFinding.findPath(me.pos, this.config.targetPos);

        if (path.length > 1) {
            this.config.pathFindingFailures = Math.max(0, this.config.pathFindingFailures - 1);
            this.config.path = path;
            return path[1]; // the first pos is my own position
        } else {
            this.config.pathFindingFailures += 1;
        }

        return null;
    }

    private getMostProbablePosFromPath(ix: number, myPos: Pos): Pos {
        const pos = this.config.path[ix];
        const hasNext = this.config.path.length > ix + 1;

        if (!hasNext) {
            return pos;
        }

        const delta = Calculations.getDelta(myPos, pos);
        if (delta.distance > 100) {
            return pos;
        }

        return this.getMostProbablePosFromPath(ix + 1, myPos);
    }

    configure(config: GotoLocationConfig) {
        this.config = config;
    }

    getSteeringInstruction(): SteeringInstruction {
        const result = new SteeringInstruction();

        const myInfo = this.env.me();
        const delta = Calculations.getDelta(myInfo.pos, this.config.targetPos);

        let shouldCalcPath = true;

        if (this.config.path) {
            const freq = delta.distance / 5; // the closer, the more frequent we need to get a path
            if (Date.now() - this.config.lastPathTime < freq) {
                shouldCalcPath = false;
            }
        }

        const firstPosToGoTo = this.getNextPos(myInfo, shouldCalcPath);

        if (!firstPosToGoTo) {
            return result;
        }


        if (!delta || delta.distance == this.config.desiredDistanceToTarget) {
            result.targetSpeed = 0;
        } else if (delta.distance < this.config.desiredDistanceToTarget) {
            // too close
            result.targetSpeed = -1;
        } else {
            result.targetSpeed = 1;

            if (myInfo.type === 1) {
                if (this.character && delta.distance > this.character.firingRange) {
                    result.boost = true;
                } else if (this.config.desiredDistanceToTarget === 0) {
                    result.boost = true; // always boost to get to target 
                }
            }
        }

        let rotationTarget = firstPosToGoTo;
        if (result.targetSpeed === 0) {
            // very close, turn towards the target, not towards the first pos in the path
            rotationTarget = this.config.targetPos;
        }

        const desiredRotation = Calculations.getTargetRotation(myInfo.pos, rotationTarget);
        const angleDiff = Calculations.getAngleDiff(myInfo.rot, desiredRotation);
        result.rotDelta = angleDiff;

        // if very close, but angle is steep, slow down for a while
        if (delta.distance < 250) {
            if (angleDiff > Math.PI / 4) {
                result.targetSpeed = -1;
            } else if (angleDiff > Math.PI / 5) {
                result.targetSpeed = 0;
            }
        }

        if (this.config.backwards) {
            result.targetSpeed = -result.targetSpeed;
            result.rotDelta += Math.PI;
            if (result.rotDelta > Math.PI * 2) {
                result.rotDelta -= Math.PI * 2;
            }
        }

        return result;
    }

}