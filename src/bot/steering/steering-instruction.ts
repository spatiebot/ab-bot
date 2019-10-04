export class SteeringInstruction {
    rotDelta: number;
    targetSpeed: number;
    fire: boolean;
    fart: boolean;
    boost: boolean;

    toString(): string {
        let results = [];
        if (this.rotDelta) {
            results.push(`Turn ${this.rotDelta}`);
        } 
        if (this.targetSpeed) {
            results.push(`Speed to ${this.targetSpeed}`);
        }
        if (this.fire) {
            results.push(`Fire: ${this.fire}`);
        }
        if (this.boost) {
            results.push(`Boost: ${this.boost};`);
        }
        if (this.fart) {
            results.push(`Fart: ${this.fart};`);
        }

        return results.reduce((prev, current) => prev + '\n' + current);
    }
}