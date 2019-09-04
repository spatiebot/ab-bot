"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Mob {
    constructor(m) {
        if (m != null) {
            this.copyFrom(m);
        }
    }
    isStale() {
        return Date.now() - this.lastUpdate > 2000;
    }
    copyFrom(m) {
        this.ownerID = m.ownerID || this.ownerID;
        this.type = m.type || this.type;
        this.posX = m.posX;
        this.posY = m.posY;
        this.speedX = m.speedX;
        this.speedY = m.speedY;
        this.lastUpdate = Date.now();
    }
}
exports.Mob = Mob;
//# sourceMappingURL=Mob.js.map