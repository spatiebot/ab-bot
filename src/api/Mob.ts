import { StopWatch } from "../helper/timer";

const STALENESS_TIMEOUT_SECONDS = 2;

export class Mob {

    private stalenessTimer = new StopWatch();

    constructor(m: Mob) {
        if (m != null) {
            this.copyFrom(m);
        }
    }

    id: number;
    ownerID: number;
    type: number;
    posX: number;
    posY: number;
    stationary: boolean;
    speedX: number;
    speedY: number;
    rot: number;
    lastUpdate: number;
    accelX: number;
    accelY: number;
    maxSpeed: number;

    isStale(): boolean {
        return this.stalenessTimer.elapsedSeconds() > STALENESS_TIMEOUT_SECONDS;
    }

    get msSinceLastActive(): number {
        return this.stalenessTimer.elapsedMs();
    }

    update(timefrac: number): void {
        let oldSpeedX: number;
        let oldSpeedY: number;
        const limit = timefrac > .51 ? Math.round(timefrac) : 1;
        const timeFactor = timefrac / limit;

        if (!this.accelX && this.accelX !== 0) {
            return;
        }

        if (this.accelX || this.accelY) {
            for (let times = 0; times < limit; times++) {
                oldSpeedX = this.speedX;
                oldSpeedY = this.speedY;
                this.speedX += this.accelX * timeFactor;
                this.speedY += this.accelY * timeFactor;
            }
        }

        if (this.speedX || this.speedY) {
            const length = Math.sqrt(Math.pow(this.speedX, 2) + Math.pow(this.speedY, 2));
            if (length > this.maxSpeed) {
                const factor = this.maxSpeed / length;
                this.speedX *= factor;
                this.speedY *= factor;
            }

            if (this.isStale()) {
                const factor = 1 - .03 * timeFactor;
                this.speedX *= factor;
                this.speedY *= factor;
            }
        }

        if (oldSpeedX || oldSpeedY || this.speedX || this.speedY) {
            this.posX += timeFactor * oldSpeedX + .5 * (this.speedX - oldSpeedX) * timeFactor;
            this.posY += timeFactor * oldSpeedY + .5 * (this.speedY - oldSpeedY) * timeFactor;
        }
    }

    copyFrom(m: Mob) {
        this.id = m.id;

        let isUpdateSignificant = false;

        if (m.stationary != null) {
            this.stationary = m.stationary;
        }

        if (m.ownerID != null) {
            this.ownerID = m.ownerID;
        }

        if (m.type != null) {
            this.type = m.type;
        }

        if (m.posX != null) {
            if (this.posX !== m.posX || this.posY !== m.posY) {
                isUpdateSignificant = true;
            }
            this.posX = m.posX;
            this.posY = m.posY;
        }

        if (m.speedX != null) {
            if (this.speedX !== m.speedX || this.speedY !== m.speedY) {
                isUpdateSignificant = true;
            }
            this.speedX = m.speedX;
            this.speedY = m.speedY;
        }
        if (m.rot != null) {
            if (this.rot !== m.rot) {
                isUpdateSignificant = true;
            }
            this.rot = m.rot;
        }
        if (m.accelX != null) {
            if (this.accelY !== m.accelY || this.accelX !== m.accelX) {
                isUpdateSignificant = true;
            }
            this.accelX = m.accelX;
            this.accelY = m.accelY;
        }
        if (m.maxSpeed != null) {
            this.maxSpeed = m.maxSpeed;
        }

        if (isUpdateSignificant) {
            this.stalenessTimer.start();
        }
    }
}