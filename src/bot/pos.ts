export class Pos {
    constructor(config: { x: number, y: number } = null) {
        if (config) {
            this.x = config.x;
            this.y = config.y;
        }
    }

    x: number;
    y: number;
    isAccurate: boolean;
}