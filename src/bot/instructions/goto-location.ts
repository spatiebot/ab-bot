/// <reference types="node" />

import { IInstruction } from "./iinstruction";
import { SteeringInstruction } from "../steering/steering-instruction";
import { Calculations } from "../calculations";
import { BotCharacter } from "../bot-character";
import { GotoLocationConfig } from "./goto-location-config";
import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { PlayerInfo } from "../airmash/player-info";
import { Pos } from "../pos";
import { StopWatch } from "../../helper/timer";
import { FlagHelpers } from "../../helper/flaghelpers";
import { Missile } from "../airmash/missile";
import * as workerpool from "workerpool";
import { Logger } from "../../helper/logger";
import { MissileHelper } from "../../helper/missilehelper";

declare const __dirname: string;

const pfPool = workerpool.pool(__dirname + '/../pathfinding/path-finding.js');
let pathfindingRequests = 0;
let pathfindingRequestsFailed = 0;
let fatalPathFindingFailures = 0;
let honoredPathFindingRequests = 0;
const pathFindingRequestTimer = new StopWatch();
pathFindingRequestTimer.start();

export class GotoLocationInstruction implements IInstruction {

    private config: GotoLocationConfig;

    constructor(private env: IAirmashEnvironment, private logger: Logger, private character: BotCharacter, private targetPlayerId = null) {
    }

    private async getNextPos(me: PlayerInfo, deltaToTarget: { diffX: number; diffY: number; distance: number }): Promise<Pos> {

        let myPos = me.pos;
        if (this.character && this.character.predictPositions) {
            myPos = Calculations.predictPosition(this.env.getPing(), myPos, me.speed);
        }

        let targetPos: Pos;
        if (this.config.shouldFleeFrom) {
            // we need to flee from this target actually
            // draw a line from target trough me, and fly to that point
            targetPos = new Pos({
                x: myPos.x - deltaToTarget.diffX,
                y: myPos.y - deltaToTarget.diffY
            });
        } else {
            targetPos = this.config.targetPos;
        }

        try {
            if (this.config.shouldCalculatePath()) {
                const path = await this.findPath(MissileHelper.getHostileMissiles(this.env), myPos, me.type, targetPos, me.id);
                this.config.setLastPath(path);
                honoredPathFindingRequests++;
            }

            if (!this.config.lastPath || this.config.lastPath.length === 0) {
                throw new Error("did not find a path");
            }

            this.config.errors = 0;
            return this.config.lastPath[1]; // first pos is always my own pos
        } catch (error) {
            this.config.errors++;
            pathfindingRequestsFailed++;
            if (this.config.errors > 20) {
                fatalPathFindingFailures++;
                throw error;
            }
        } finally {

            pathfindingRequests++;
            const secs = pathFindingRequestTimer.elapsedSeconds();
            if (secs > 3) {
                this.logger.debug(
                    "Pathfindingrequests/s: " + Math.round(pathfindingRequests / secs) +
                    ", honored: " + Math.round(honoredPathFindingRequests / secs) +
                    ", failed: " + Math.round(pathfindingRequestsFailed / secs) +
                    ", fatal: " + Math.round(fatalPathFindingFailures / secs)
                );

                this.logger.debug("Pool stats", pfPool.stats());

                pathFindingRequestTimer.start();
                pathfindingRequests = 0;
                pathfindingRequestsFailed = 0;
                honoredPathFindingRequests = 0;
                fatalPathFindingFailures = 0;
            }
        }
    }

    private async findPath(missiles: Missile[], myPos: Pos, myType: number, targetPos: Pos, myID: number): Promise<Pos[]> {
        const params = {
            missiles,
            myPos,
            targetPos,
            myType
        };

        const path = await pfPool.exec('doPathFinding', [params]).timeout(800);
        return path;
    }

    configure(config: GotoLocationConfig) {
        this.config = config;
    }

    async getSteeringInstruction(): Promise<SteeringInstruction> {
        const result = new SteeringInstruction();

        const myInfo = this.env.me();
        const delta = Calculations.getDelta(myInfo.pos, this.config.targetPos);

        const firstPosToGoTo = await this.getNextPos(myInfo, delta);

        if (!delta || delta.distance == this.config.desiredDistanceToTarget) {
            result.targetSpeed = 0;
        } else if (delta.distance < this.config.desiredDistanceToTarget) {
            // too close
            result.targetSpeed = -1;
        } else {
            result.targetSpeed = 1;

            if (myInfo.type === 1) {
                const isCarryingFlag = FlagHelpers.isCarryingFlag(this.env);
                if (!isCarryingFlag) {
                    const boostDistance = this.character ? this.character.firingRange : 200;
                    if (delta.distance > boostDistance) {
                        result.boost = true;
                    }
                }
            }
        }

        let rotationTarget = firstPosToGoTo;
        if (delta.distance < this.config.desiredDistanceToTarget) {
            // very close, turn towards the target, not towards the first pos in the path
            rotationTarget = this.config.targetPos;
        }

        if (rotationTarget) {
            let desiredRotation = Calculations.getTargetRotation(myInfo.pos, rotationTarget);

            if (this.config.shouldFleeFrom || this.config.flyBackwards) {
                result.targetSpeed = -result.targetSpeed;
                desiredRotation += Math.PI;
                if (desiredRotation > Math.PI * 2) {
                    desiredRotation -= Math.PI * 2;
                }
            }

            const angleDiff = Calculations.getAngleDiff(myInfo.rot, desiredRotation);
            result.rotDelta = angleDiff;

            // if very close, but angle is steep, slow down for a while
            if (!this.config.shouldFleeFrom && delta.distance < 250) {
                if (angleDiff > Math.PI / 4) {
                    result.targetSpeed = -1;
                } else if (angleDiff > Math.PI / 5) {
                    result.targetSpeed = 0;
                }
            }
        }

        return result;
    }

}