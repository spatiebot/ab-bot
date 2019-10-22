/// <reference types="node" />

import { parentPort } from "worker_threads";
import { mountains } from "./mountains";
import { Pos } from "../pos";
import easystarjs from "easystarjs";
import { Missile } from "../airmash/missile";
import { simplifyPath } from "./simplifyPath";

parentPort.on("message", message => run(message));

const width = 1650;
const height = 830;
const scaleDown = width / 33000; // scale relative to airmash map
const scaleUp = 33000 / width; // scale relative to airmash map
const transX = 825; // translation: airmash has it's center at 0,0
const transY = 415;
const grids = {};

for (let type = 1; type <= 5; type++) {
    grids[type] = createGrid(type);
}

function createGrid(type: number): number[][] {
    var grid: number[][] = [];
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            if (!grid[y]) {
                grid[y] = [];
            }

            grid[y][x] = 0;
        }
    }

    for (var m of mountains[type]) {
        grid[m.y][m.x] = 1;
    }

    return grid;
}

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

async function run(workerData) {

    const missiles: Missile[] = workerData.missiles;
    const myPos: Pos = workerData.myPos;
    const myType: number = workerData.myType;
    const targetPos: Pos = workerData.targetPos;
    const distance: number = workerData.distance;

    try {
        const pathFinding = new PathFinding(grids[myType], missiles);
        const path = await pathFinding.findPath(myPos, targetPos);
        parentPort.postMessage({ path });
    } catch (error) {
        parentPort.postMessage({ error });
    }
}

class PathFinding {
    constructor(private grid: number[][], private missiles: Missile[]) {
    }

    findPath(firstPos: Pos, targetPos: Pos): Promise<Pos[]> {
        return new Promise((resolve, reject) => {
            var easystar = new easystarjs.js();
            easystar.setGrid(this.grid);

            for (let m of this.missiles) {
                const missilePos = posToGridPos(m.pos);
                easystar.avoidAdditionalPoint(missilePos.x, missilePos.y);
            }

            easystar.setAcceptableTiles([0]);
            easystar.enableDiagonals();
            easystar.enableCornerCutting();

            const gridFirstPos = posToGridPos(firstPos);
            const gridTargetPos = posToGridPos(targetPos);

            easystar.findPath(gridFirstPos.x, gridFirstPos.y, gridTargetPos.x, gridTargetPos.y, path => {
                const airmashPath = path.map(x => posToAirmashPos(x));
                const simplifiedAirmashPath = simplifyPath(airmashPath, 100);
                resolve(simplifiedAirmashPath);
            });
            easystar.calculate();
        });
    }
}
