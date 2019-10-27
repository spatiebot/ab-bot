import { Pos } from "../pos";
import easystarjs from "easystarjs";
import { Missile } from "../airmash/missile";
import { simplifyPath } from "./simplifyPath";
import * as fs from 'fs';

const gridContainer = gridContainerFromMountainData("data/mountains.json");

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

async function doPathFinding(missiles: Missile[], myPos: Pos, myType: number, targetPos: Pos): Promise<Pos[]> {

    let grid: number[][];

    grid = gridContainer.grids[myType];

    const pathFinding = new PathFinding(grid, missiles, 
        pos => gridContainer.posToGridPos(pos), 
        pos => gridContainer.posToAirmashPos(pos));

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