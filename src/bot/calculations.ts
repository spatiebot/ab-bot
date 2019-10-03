import { Pos } from "./pos";

export class Calculations {

    static getDelta(first: Pos, second: Pos): { diffX: number, diffY: number, distance: number } {
        if (!first || !second) {
            return null;
        }

        const diffX = second.x - first.x;
        const diffY = second.y - first.y;
        const distance = Math.sqrt(diffX * diffX + diffY * diffY);
        return {
            diffX,
            diffY,
            distance
        };
    }

    static getAngleDiff(current: number, target: number): number {
        return Math.atan2(Math.sin(target - current), Math.cos(target - current));
    }

    static getTargetRotation(pos1: Pos, pos2: Pos): number {
        let theta = Math.atan2(pos2.x - pos1.x, pos1.y - pos2.y);
        if (theta < 0) {
            theta += Math.PI * 2;
        }

        return theta;
    }

    static getRandomInt(minClusive, maxExclusive: number) {
        minClusive = Math.ceil(minClusive);
        maxExclusive = Math.floor(maxExclusive);
        return Math.floor(Math.random() * (maxExclusive - minClusive)) + minClusive; //The maximum is exclusive and the minimum is inclusive
    }

    static predictPosition(ms: number, pos: Pos, speed: Pos): Pos {
        if (!speed) {
            return pos;
        }
        const pred = new Pos({
            x: pos.x + speed.x * (ms / 20),
            y: pos.y + speed.y * (ms / 20)
        });

        const delta = Calculations.getDelta(pos, pred);
        if (!delta || delta.distance > 100) {
            return pos;
        }

        return pred;
    }

}