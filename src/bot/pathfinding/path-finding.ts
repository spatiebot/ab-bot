/// <reference types="node" />

import { parentPort } from "worker_threads";
import { Pos } from "../pos";
import easystarjs from "easystarjs";
import { Missile } from "../airmash/missile";
import { simplifyPath } from "./simplifyPath";
import * as fs from 'fs';
import logger from "../../helper/logger";

const gridContainerSmall = gridContainerFromMountainData("data/mountains.json");
const gridContainerLarge = gridContainerFromMountainData("data/mountains-large.json");

const MAX_WIDTH = 800;
const MAX_HEIGHT = 600;

if (parentPort) {
    parentPort.on("message", message => run(message));
}

function gridContainerFromMountainData(path: string) {
    const json = fs.readFileSync(path, "utf-8");

    const mountains = JSON.parse(json);

    const width = mountains.grid.width;
    const height = mountains.grid.height;
    const scaleDown = width / 33000; // scale relative to airmash map
    const scaleUp = 33000 / width; // scale relative to airmash map
    const transX = width / 2; // translation: airmash has it's center at 0,0
    const transY = height / 2;
    const grids = {};

    for (let type = 1; type <= 5; type++) {
        grids[type] = createGrid(type, mountains);
    }

    return {
        width,
        height,
        grids,
        scaleUp,
        posToGridPos,
        posToAirmashPos,

        cutGrid(type: number, myPos: Pos, targetPos: Pos) {
            const fullGrid = grids[type];
            const pos1 = posToGridPos(myPos);
            const pos2 = posToGridPos(targetPos);
            const center = new Pos({
                x: Math.round((pos1.x + pos2.x) / 2),
                y: Math.round((pos1.y + pos2.y) / 2)
            });
            const topLeftCorner = new Pos({
                x: Math.max(0, center.x - MAX_WIDTH / 2),
                y: Math.max(0, center.y - MAX_HEIGHT / 2)
            });

            const bottomRightCorner = new Pos({
                x: Math.min(center.x + MAX_WIDTH / 2, width),
                y: Math.min(center.y + MAX_HEIGHT / 2, height)
            });

            const cutGrid: number[][] = [];
            for (let x = topLeftCorner.x, cutGridX = 0; x < bottomRightCorner.x; x++ , cutGridX++) {
                for (let y = topLeftCorner.y, cutGridY = 0; y < bottomRightCorner.y; y++ , cutGridY++) {
                    if (!cutGrid[cutGridY]) {
                        cutGrid[cutGridY] = [];
                    }

                    cutGrid[cutGridY][cutGridX] = fullGrid[y][x];
                }
            }

            return {
                cutGrid,
                toCutGridPos(pos: Pos): Pos {
                    return new Pos({
                        x: pos.x - topLeftCorner.x,
                        y: pos.y - topLeftCorner.y
                    });
                },
                fromCutGridPos(pos: Pos): Pos {
                    return new Pos({
                        x: pos.x + topLeftCorner.x,
                        y: pos.y + topLeftCorner.y
                    });
                }
            };
        }
    };

    function posToGridPos(pos: Pos): Pos {
        return new Pos({
            x: Math.round(pos.x * scaleDown + transX),
            y: Math.round(pos.y * scaleDown + transY)
        });
    }

    function posToAirmashPos(pos: { x: number, y: number }): Pos {
        return new Pos({
            x: (pos.x - transX) * scaleUp,
            y: (pos.y - transY) * scaleUp
        });
    }

    function createGrid(type: number, mountains: any): number[][] {

        const width = mountains.grid.width;
        const height = mountains.grid.height;

        const grid: number[][] = [];
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                if (!grid[y]) {
                    grid[y] = [];
                }

                grid[y][x] = 0;
            }
        }

        for (let m of mountains[type]) {
            grid[m.y][m.x] = Math.round(m.v / 10);
        }

        return grid;
    }
}

async function run(workerData) {

    const missiles: Missile[] = workerData.missiles;
    const myPos: Pos = workerData.myPos;
    const myType: number = workerData.myType;
    const targetPos: Pos = workerData.targetPos;
    const distance: number = workerData.distance;

    try {
        const path = await doPathFinding(missiles, myPos, myType, targetPos, distance);
        parentPort.postMessage({ path });
    } catch (error) {
        parentPort.postMessage({ error });
    }
}

async function doPathFinding(missiles: Missile[], myPos: Pos, myType: number, targetPos: Pos, distance: number): Promise<Pos[]> {

    const maxDistanceOnDetailedMap = (MAX_HEIGHT / 2) * gridContainerLarge.scaleUp;

    let grid: number[][];
    let posToGridPos: (pos: Pos) => Pos;
    let posToAirmashPos: (pos: Pos) => Pos;

    if (distance < maxDistanceOnDetailedMap && myType !== 2) {
        // cut grid from detailed map
        const cutGridInfo = gridContainerLarge.cutGrid(myType, myPos, targetPos);
        posToGridPos = function (pos: Pos) {
            return cutGridInfo.toCutGridPos(gridContainerLarge.posToGridPos(pos))
        };
        posToAirmashPos = function (pos: any) {
            return gridContainerLarge.posToAirmashPos(cutGridInfo.fromCutGridPos(pos));
        }

        grid = cutGridInfo.cutGrid;
    } else {
        grid = gridContainerSmall.grids[myType];
        posToGridPos = gridContainerSmall.posToGridPos;
        posToAirmashPos = gridContainerSmall.posToAirmashPos;
    }

    const pathFinding = new PathFinding(grid, missiles, posToGridPos, posToAirmashPos);
    const path = await pathFinding.findPath(myPos, targetPos);
    return path;
}

class PathFinding {
    constructor(
        private grid: number[][],
        private missiles: Missile[],
        private posToGridPos: (pos: Pos) => Pos,
        private posToAirmashPos: (pos: any) => Pos) {
    }

    findPath(firstPos: Pos, targetPos: Pos): Promise<Pos[]> {
        return new Promise((resolve, reject) => {
            var easystar = new easystarjs.js();
            easystar.setGrid(this.grid);

            for (let m of this.missiles) {
                const missilePos = this.posToGridPos(m.pos);
                easystar.avoidAdditionalPoint(missilePos.x, missilePos.y);
            }

            easystar.setAcceptableTiles([0, 1, 2]);
            easystar.setTileCost(1, 10);
            easystar.setTileCost(2, 50);

            easystar.enableDiagonals();
            easystar.enableCornerCutting();

            const gridFirstPos = this.posToGridPos(firstPos);
            const gridTargetPos = this.posToGridPos(targetPos);

            easystar.findPath(gridFirstPos.x, gridFirstPos.y, gridTargetPos.x, gridTargetPos.y, path => {
                if (!path) {
                    reject('no path found');
                    return;
                }
                const airmashPath = path.map(x => this.posToAirmashPos(x));
                const simplifiedAirmashPath = simplifyPath(airmashPath, 100);
                resolve(simplifiedAirmashPath);
            });
            easystar.calculate();
        });
    }
}

export { doPathFinding }