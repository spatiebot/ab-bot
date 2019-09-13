export class Mob {

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

    isStale(): boolean {
        return Date.now() - this.lastUpdate > 2000;
    }

    copyFrom(m: Mob) {
        this.id = m.id;

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
            this.posX = m.posX;
            this.posY = m.posY;
        }
        if (m.speedX != null) {
            this.speedX = m.speedX;
            this.speedY = m.speedY;
        }
        if (m.rot != null) {
            this.rot = m.rot;
        }

        this.lastUpdate = Date.now();
    }
}