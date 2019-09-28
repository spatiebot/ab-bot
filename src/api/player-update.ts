import { Player } from "./Player";
import { ships } from "./ships";
import { upgrades } from "./upgrades";

export class PlayerUpdate {
    constructor(private player: Player) {
    }

    /**
     * 
     * @param timeFrac 
     */
    exec(timeFrac: number) {
        const circle = 2 * Math.PI;
        const delta = this.player.boost ? 1.5 : 1;

        const limit = timeFrac > .51 ? Math.round(timeFrac) : 1;
        const timeFactor = timeFrac / limit;

        if (!this.player.keystate) {
            return;
        }

        for (let times = 0; times < limit; times++) {
            this.player.energy += timeFactor * this.player.energyRegen;
            this.player.energy = Math.min(1, this.player.energy);

            this.player.health += timeFactor * this.player.healthRegen;
            this.player.health = Math.min(1, this.player.health);

            let currentRot = -999;
            if (this.player.strafe) {
                if (this.player.keystate.LEFT) {
                    currentRot = this.player.rot - .5 * Math.PI;
                }
                if (this.player.keystate.RIGHT) {
                    currentRot = this.player.rot + .5 * Math.PI;
                }
            } else {
                if (this.player.keystate.LEFT) {
                    this.player.rot += -timeFactor * ships[this.player.type].turnFactor;
                }
                if (this.player.keystate.RIGHT) {
                    this.player.rot += timeFactor * ships[this.player.type].turnFactor;
                }
            }
            const drawOffsetX = this.player.speedX;
            const drawOffsetY = this.player.speedY;
            if (this.player.keystate.UP) {
                if (currentRot === -999) {
                    currentRot = this.player.rot;
                } else {
                    currentRot = currentRot + Math.PI * (this.player.keystate.RIGHT ? -.25 : .25);
                }
            } else {
                if (this.player.keystate.DOWN) {
                    if (currentRot === -999) {
                        currentRot = this.player.rot + Math.PI;
                    } else {
                        currentRot = currentRot + Math.PI * (this.player.keystate.RIGHT ? .25 : -.25);
                    }
                }
            }
            if (currentRot !== -999) {
                this.player.speedX += Math.sin(currentRot) * ships[this.player.type].accelFactor * timeFactor * delta;
                this.player.speedY -= Math.cos(currentRot) * ships[this.player.type].accelFactor * timeFactor * delta;
            }

            const range =  Math.sqrt(Math.pow(this.player.speedX,2) + Math.pow(this.player.speedY,2));
            let pathWidth = ships[this.player.type].maxSpeed * delta * 1 // TODO * upgrades.speed.factor[this.player.speedupgrade];
            const maxX = ships[this.player.type].minSpeed;
            // TODO:
            // if (this.player.powerups.rampage) {
            //     pathWidth = pathWidth * .75;
            // }
            // if (this.player.flagspeed) {
            //     pathWidth = 5;
            // }
            if (range > pathWidth) {
                this.player.speedX *= pathWidth / range;
                this.player.speedY *= pathWidth / range;
            } else {
                if (this.player.speedX > maxX || this.player.speedX < -maxX || this.player.speedY > maxX || this.player.speedY < -maxX) {
                    this.player.speedX *= 1 - ships[this.player.type].brakeFactor * timeFactor;
                    this.player.speedY *= 1 - ships[this.player.type].brakeFactor * timeFactor;
                } else {
                    this.player.speedX = 0;
                    this.player.speedY = 0;
                }
            }
            this.player.posX += timeFactor * drawOffsetX + .5 * (this.player.speedX - drawOffsetX) * timeFactor * timeFactor;
            this.player.posY += timeFactor * drawOffsetY + .5 * (this.player.speedY - drawOffsetY) * timeFactor * timeFactor;
        }
        this.player.rot = (this.player.rot % circle + circle) % circle;
    }
}