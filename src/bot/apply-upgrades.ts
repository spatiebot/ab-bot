import { IAirmashEnvironment } from "./airmash/iairmash-environment";
import { Score } from "./airmash/score";
import { BotCharacter } from "./bot-character";
import logger = require("../helper/logger");

export class ApplyUpgrades {
    constructor(private env: IAirmashEnvironment, private character: BotCharacter) {
    }

    execute(score: Score): void {
        if (score && score.upgrades > 0) {
            const me = this.env.me();
            const current = [0, me.upgrades.speed, me.upgrades.defense, me.upgrades.energy, me.upgrades.missile];
            const getUpgradeToApply = (ix = 0) => {
                if (ix > 3) {
                    return 0;
                }
                const up = this.character.upgradePriority[ix];
                const currentUp = current[up];
                if (currentUp === 5) {
                    return getUpgradeToApply(ix + 1);
                }
                return up;
            };
            const upgradeToApply = getUpgradeToApply();
            if (upgradeToApply > 0) {
                logger.info("apply upgrade " + upgradeToApply);
                this.env.sendCommand("upgrade", upgradeToApply.toString());

                score.upgrades -= 1;
            }
        }
    }
}