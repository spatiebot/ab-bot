/// <reference types="node" />

import { Calculations } from "../calculations";
import { PlayerInfo } from "../airmash/player-info";
import { Pos } from "../pos";
import { parentPort } from "worker_threads";
import { Grid, AStarFinder, Util } from "pathfinding";

let mountains;

parentPort.on("message", message => run(message));

function run(workerData) {

    const walls = workerData.walls;
    const missiles = workerData.missiles;
    const players = workerData.players;
    const myPos = workerData.myPos;
    const targetPos = workerData.targetPos;
    const distance = workerData.distance;

    try {
        const pathFinding = new PathFinding(walls, missiles, players);
        const path = pathFinding.findPath(myPos, targetPos, distance);
        parentPort.postMessage({ path });
    } catch (error) {
        parentPort.postMessage({ error });
    }
}

class ScaledPos extends Pos {
    scale: number;

    static fromPos(pos: Pos): ScaledPos {
        return { ...pos, scale: null };
    }
}

class PathFinding {

    private readonly mobstacles: any[];
    private readonly playerObstacles: any[];

    private readonly navConfig = {
        // map is -16352 to 16352 in the x direction and -8160 to 8160 in the y-direction
        mapProperties: { left: -16500, top: -8300, right: 16500, bottom: 8300 },
        maxGridLength: 3000,
        marginStep: 500,
        defaultScale: 0.2
    };

    private scaleFactor: number;

    constructor(walls: number[][], missiles: any[], playersToAvoid: PlayerInfo[]) {

        if (!mountains) {
            mountains = walls.map(w => {
                return {
                    x: w[0],
                    y: w[1],
                    size: w[2],
                };
            });
        }

        this.mobstacles = missiles.map(m => {
            const pos = Calculations.predictPosition(50, m.pos, m.speed);
            return {
                x: pos.x,
                y: pos.y,
                size: 50
            };
        });

        this.playerObstacles = playersToAvoid.map(p => {
            const pos = Calculations.predictPosition(50, p.pos, p.speed);
            return {
                x: pos.x,
                y: pos.y,
                size: 50
            };
        });
    }

    private getGrid(width: number, height: number, left: number, top: number): any {

        const grid = new Grid(Math.ceil(width), Math.ceil(height));

        const removeWalkabilityfor = obstacle => {
            const scaledObstacle = {
                x: obstacle.x * this.scaleFactor,
                y: obstacle.y * this.scaleFactor,
                size: obstacle.size * this.scaleFactor
            };

            if (scaledObstacle.x < left - scaledObstacle.size || scaledObstacle.x > left + width + scaledObstacle.size) {
                return;
            }
            if (scaledObstacle.y < top - scaledObstacle.size || scaledObstacle.y > top + height + scaledObstacle.size) {
                return;
            }

            // remove walkability of this mountain
            const obsLeft = scaledObstacle.x - scaledObstacle.size;
            const obsRight = scaledObstacle.x + scaledObstacle.size;
            const obsTop = scaledObstacle.y - scaledObstacle.size;
            const obsBottom = scaledObstacle.y + scaledObstacle.size;
            for (let i = obsLeft; i <= obsRight; i++) {
                for (let j = obsTop; j <= obsBottom; j++) {
                    const gridX = Math.floor(i - left);
                    const gridY = Math.floor(j - top);
                    if (gridX < 0 || gridX >= width || gridY < 0 || gridY >= height) {
                        continue;
                    }
                    grid.setWalkableAt(gridX, gridY, false);
                }
            }
        };

        mountains.forEach(x => removeWalkabilityfor(x));
        this.mobstacles.forEach(x => removeWalkabilityfor(x));
        //        this.playerObstacles.forEach(x => removeWalkabilityfor(x));

        return grid;
    }

    private scale(pos: ScaledPos): ScaledPos {
        if (pos.scale) {
            // has already been scaled
            return pos;
        }
        return {
            x: pos.x * this.scaleFactor,
            y: pos.y * this.scaleFactor,
            scale: this.scaleFactor,
            isAccurate: pos.isAccurate
        };
    }

    public findPath(myPos: Pos, otherPos: Pos, distance: number): Pos[] {

        this.scaleFactor = 0.01;
        let initialMargin = this.scaleFactor * this.navConfig.marginStep;
        let nearPos: Pos;

        // do a very rough estimate for a first run
        if (distance >= 400) {
            const estimate = this.findPathInner(ScaledPos.fromPos(myPos), ScaledPos.fromPos(otherPos), initialMargin);
            nearPos = this.getPosOnGoodDistance(myPos, estimate.posList, 1);
            if (!nearPos) {
                throw new Error('pathfinding apparently failed');
            }
        } else {
            nearPos = otherPos;
        }
        this.scaleFactor = 1 / 36; // the smallest mountain is 36

        initialMargin = this.scaleFactor * this.navConfig.marginStep;
        const result = this.findPathInner(ScaledPos.fromPos(myPos), ScaledPos.fromPos(otherPos), initialMargin);
        return result.smoothenedPosList;
    }

    private getPosOnGoodDistance(myPos, posList: Pos[], index: number) {
        const pos = posList[index];
        if (!pos) {
            return null;
        }

        const distance = Calculations.getDelta(myPos, pos).distance;
        if (distance >= 400 || index == posList.length + 1) {
            return pos;
        }
        return this.getPosOnGoodDistance(myPos, posList, index + 1);
    }

    public findPathInner(myPos: ScaledPos, otherPos: ScaledPos, scaledMargin: number, level: number = 1): { smoothenedPosList: Pos[], posList: Pos[] } {
        myPos = this.scale(myPos);
        otherPos = this.scale(otherPos);

        const halvarin = scaledMargin / 2;

        let gridLeft: number;
        const gridWidth = Math.abs(otherPos.x - myPos.x) + scaledMargin; // Math.min(this.navConfig.maxGridLength * this.scaleFactor, Math.abs(otherPos.x - myPos.x) + scaledMargin);
        if (otherPos.x > myPos.x) {
            gridLeft = myPos.x - halvarin;
        } else {
            gridLeft = myPos.x - gridWidth + 1 + halvarin;
        }

        if (gridLeft < this.navConfig.mapProperties.left * this.scaleFactor) {
            gridLeft = this.navConfig.mapProperties.left * this.scaleFactor;
        }
        if (gridLeft + gridWidth > this.navConfig.mapProperties.right * this.scaleFactor) {
            gridLeft = this.navConfig.mapProperties.right * this.scaleFactor - gridWidth - 1;
        }

        let gridTop: number;
        const gridHeight = Math.abs(otherPos.y - myPos.y) + scaledMargin; // Math.min(this.navConfig.maxGridLength * this.scaleFactor, Math.abs(otherPos.y - myPos.y) + scaledMargin);
        if (otherPos.y > myPos.y) {
            gridTop = myPos.y - halvarin;
        } else {
            gridTop = myPos.y - gridHeight + 1 + halvarin;
        }

        if (gridTop < this.navConfig.mapProperties.top * this.scaleFactor) {
            gridTop = this.navConfig.mapProperties.top * this.scaleFactor;
        }
        if (gridTop + gridHeight > this.navConfig.mapProperties.bottom * this.scaleFactor) {
            gridTop = this.navConfig.mapProperties.bottom * this.scaleFactor - gridHeight - 1;
        }

        // get grid with mountains
        const grid = this.getGrid(gridWidth, gridHeight, gridLeft, gridTop);

        const finder = new AStarFinder({
            allowDiagonal: true
        });

        const fromX = Math.floor(myPos.x - gridLeft);
        let fromY = Math.floor(myPos.y - gridTop);
        let toX = otherPos.x - gridLeft;
        let toY = otherPos.y - gridTop;

        // target may not be "visible" in our grid
        if (toX < 0) {
            toX = 0;
        }
        if (toX >= gridWidth) {
            toX = gridWidth - 1;
        }

        let searchDirection = 1;
        if (toY < 0) {
            toY = 0;
        }
        if (toY >= gridHeight) {
            toY = gridHeight - 1;
            searchDirection = -1;
        }

        toX = Math.floor(toX);
        toY = Math.floor(toY);

        // prevent to round to an unwalkable place: go up or down until a walkable place was found
        while (!grid.isWalkableAt(toX, toY) && toY > 0 && toY < gridHeight - 1) {
            toY += searchDirection;
        }
        while (!grid.isWalkableAt(fromX, fromY) && fromY > 0 && fromY < gridHeight - 1) {
            fromY += searchDirection;
        }

        let path = finder.findPath(fromX, fromY, toX, toY, grid);

        if (path.length > 0) {
            const posList = [];
            for (let i = 0; i < path.length; i++) {
                const x = (path[i][0] + gridLeft) / this.scaleFactor;
                const y = (path[i][1] + gridTop) / this.scaleFactor;
                posList.push({ x, y });
            }

            const smoothenedPath = Util.smoothenPath(grid, path);
            const smoothenedPosList = [];
            for (let i = 0; i < smoothenedPath.length; i++) {
                const x = (smoothenedPath[i][0] + gridLeft) / this.scaleFactor;
                const y = (smoothenedPath[i][1] + gridTop) / this.scaleFactor;
                smoothenedPosList.push({ x, y });
            }

            return { smoothenedPosList, posList };
        } else {
            // this is an unwalkable path. Try broadening the grid to find a way around an obstacle (mountain)
            if (level > 5 || scaledMargin >= this.navConfig.maxGridLength * this.scaleFactor) {
                throw new Error("unable to find walkable path");
            }

            return this.findPathInner(myPos, otherPos, scaledMargin + (this.navConfig.marginStep * this.scaleFactor), level + 1);
        }
    }
}
