/// <reference types="node" />

import { IInstruction } from "./iinstruction";
import { SteeringInstruction } from "../steering/steering-instruction";
import { Calculations } from "../calculations";
import { BotCharacter } from "../bot-character";
import { GotoLocationConfig } from "./goto-location-config";
import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { PlayerInfo } from "../airmash/player-info";
import { Pos } from "../pos";
import { Worker } from "worker_threads";
import logger = require("../../helper/logger");
import P = require("pino");

declare const __dirname: string;
let pfWorker: Worker;

function createNewWorker() {
    if (pfWorker) {
        pfWorker.terminate();
    }

    pfWorker = new Worker(__dirname + '/../pathfinding/path-finding.js');
}
createNewWorker();

const NEXT_PATH_POINT_DISTANCE_THRESHOLD = 30;

export class GotoLocationInstruction implements IInstruction {

    private config: GotoLocationConfig;

    constructor(private env: IAirmashEnvironment, private character: BotCharacter, private targetPlayerId = null) {
    }

    private async getNextPos(me: PlayerInfo, shouldCalcPath: boolean, deltaToTarget: { diffX: number, diffY: number, distance: number }): Promise<Pos> {
        // prevent one-time inaccurate readings to disturb the path
        const isDisturbingPos = this.config.prevTargetPos && this.config.prevTargetPos.isAccurate && !this.config.targetPos.isAccurate;
        shouldCalcPath = shouldCalcPath && !isDisturbingPos;

        if (!shouldCalcPath) {
            if (this.config.path && this.config.path.length > 0) {
                logger.warn("path from cached");
                return this.walkPath();
            }
        }

        // const players = this.env.getPlayers().filter(x => x.id !== me.id && x.id !== this.targetPlayerId);

        let myPos = me.pos;
        if (this.character && this.character.predictPositions) {
            myPos = Calculations.predictPosition(this.env.getPing(), myPos, me.speed);
        }

        let targetPos: Pos;
        if (this.config.backwards) {
            // we need to flee from this target actually
            // draw a line from target trough me, and fly to that point
            targetPos = new Pos({
                x: myPos.x - deltaToTarget.diffX,
                y: myPos.y - deltaToTarget.diffY
            });
        } else {
            targetPos = this.config.targetPos;
        }

        const pathFindingConfig = {
            missiles: this.env.getMissiles(),
            myPos,
            myType: me.type,
            targetPos,
            distance: deltaToTarget.distance
        };

        try {
            const path = await this.findPath(pathFindingConfig);

            this.config.path = path;
            this.config.errors = 0;
            return this.walkPath();
        } catch (error) {
            // just fly dumbly towards the target
            this.config.errors++;

            if (this.config.errors > 20) {
                throw error;
            }

            return targetPos;
        }
    }

    private walkPath(next = 0) : Pos {
        if (!this.config.path || this.config.path.length === 0) {
            logger.error("No path left to walk");
            this.config.needNewPath = true;
            return new Pos({x: 0, y: 0}); // sorry
        }
        var pos = this.config.path[next];
        this.config.path = this.config.path.slice(next + 1);

        const delta = Calculations.getDelta(this.env.me().pos, pos)
        if (delta.distance < NEXT_PATH_POINT_DISTANCE_THRESHOLD) {
            return this.walkPath();
        }

        return pos;
    }

    private findPath(pathFindingConfig: any): Promise<Pos[]> {
        pfWorker.removeAllListeners();

        const pfPromise = new Promise<Pos[]>((resolve, reject) => {

            function cleanUp() {
                clearTimeout(timeOut);
                pfWorker.removeAllListeners();
            }

            const timeOut = setTimeout(() => {
                createNewWorker();
                cleanUp();
                reject(new Error('pathFinding timeout'));
            }, 800);

            pfWorker.on("error", err => {
                reject(err);
                cleanUp();
            });

            pfWorker.on("message", message => {
                if (message.path) {
                    resolve(message.path);
                }
                if (message.error) {
                    reject(message.error);
                }
                reject(message);
                cleanUp();
            });

            pfWorker.postMessage(pathFindingConfig);
        });

        return pfPromise;
    }


    configure(config: GotoLocationConfig) {
        this.config = config;
    }

    async getSteeringInstruction(): Promise<SteeringInstruction> {
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

        const firstPosToGoTo = await this.getNextPos(myInfo, shouldCalcPath, delta);

        if (!delta || delta.distance == this.config.desiredDistanceToTarget) {
            result.targetSpeed = 0;
        } else if (delta.distance < this.config.desiredDistanceToTarget) {
            // too close
            result.targetSpeed = -1;
        } else {
            result.targetSpeed = 1;

            if (myInfo.type === 1) {
                let isCarryingFlag = false;
                if (this.env.getGameType() === 2) {
                    const otherFlag = this.env.getFlagInfo(myInfo.team === 1 ? 2 : 1);
                    isCarryingFlag = otherFlag.carrierId === myInfo.id;
                }
                if (!isCarryingFlag) {
                    if (this.character && delta.distance > this.character.firingRange) {
                        result.boost = true;
                    } else if (this.config.desiredDistanceToTarget === 0) {
                        result.boost = true; // always boost to get to target 
                    }
                }
            }
        }

        let rotationTarget = firstPosToGoTo;
        if (result.targetSpeed === 0) {
            // very close, turn towards the target, not towards the first pos in the path
            rotationTarget = this.config.targetPos;
        }

        let desiredRotation = Calculations.getTargetRotation(myInfo.pos, rotationTarget);

        if (this.config.backwards) {
            result.targetSpeed = -result.targetSpeed;
            desiredRotation += Math.PI;
            if (desiredRotation > Math.PI * 2) {
                desiredRotation -= Math.PI * 2;
            }
        }

        const angleDiff = Calculations.getAngleDiff(myInfo.rot, desiredRotation);
        result.rotDelta = angleDiff;

        // if very close, but angle is steep, slow down for a while
        if (!this.config.backwards && delta.distance < 250) {
            if (angleDiff > Math.PI / 4) {
                result.targetSpeed = -1;
            } else if (angleDiff > Math.PI / 5) {
                result.targetSpeed = 0;
            }
        }

        return result;
    }

}