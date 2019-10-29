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
import { doPathFinding } from "../pathfinding/path-finding";
import { FlagHelpers } from "../../helper/flaghelpers";
import { Worker } from "worker_threads";
import { Missile } from "../airmash/missile";

declare const __dirname: string;
let pfWorkers = {};

function createNewWorker(id: number) {
    if (pfWorkers[id]) {
        pfWorkers[id].terminate();
    }

    pfWorkers[id] = new Worker(__dirname + '/../pathfinding/path-finding.js');
}

export class GotoLocationInstruction implements IInstruction {

    private config: GotoLocationConfig;

    constructor(private env: IAirmashEnvironment, private character: BotCharacter, private targetPlayerId = null) {
        createNewWorker(env.myId());
    }

    private async getNextPos(me: PlayerInfo, deltaToTarget: { diffX: number, diffY: number, distance: number }): Promise<Pos> {

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
                const pathFindingStopwatch = new StopWatch();
                pathFindingStopwatch.start();
                const path = await this.findPath(this.env.getMissiles(), myPos, me.type, targetPos, me.id);
                this.config.setLastPath(path, pathFindingStopwatch.elapsedMs());
            }
            this.config.errors = 0;

            return this.config.lastPath[1]; // first pos is always my own pos
        } catch (error) {
            this.config.errors++;
            if (this.config.errors > 20) {
                throw error;
            }
        }
    }

    private findPath(missiles: Missile[], myPos: Pos, myType: number, targetPos: Pos, myID: number): Promise<Pos[]> {
        const pfWorker = pfWorkers[myID];
        pfWorker.removeAllListeners();

        const pfPromise = new Promise<Pos[]>((resolve, reject) => {

            function cleanUp() {
                clearTimeout(timeOut);
                pfWorker.removeAllListeners();
            }

            const timeOut = setTimeout(() => {
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

            pfWorker.postMessage({
                missiles,
                myPos,
                targetPos,
                myType
            });
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