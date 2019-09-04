"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mob_1 = require("./Mob");
class Player extends Mob_1.Mob {
    constructor(p = null) {
        super(p);
        if (p != null) {
            this.copyFrom(p);
        }
    }
    copyFrom(p) {
        super.copyFrom(p);
        this.name = p.name || this.name;
        this.team = p.team || this.team;
        this.flag = p.flag || this.flag;
        this.rot = p.rot;
        this.upgrades = p.upgrades;
    }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map