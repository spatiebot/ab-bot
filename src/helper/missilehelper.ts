import { IAirmashEnvironment } from "../bot/airmash/iairmash-environment";
import { Missile } from "../bot/airmash/missile";

export class MissileHelper {
    static getHostileMissiles(env: IAirmashEnvironment): Missile[] {
        const me = env.me();
        const myTeam = me.team;
        const hostileMissiles = env.getMissiles().filter(x => {
            if (!x.playerID) {
                // assume hostile
                return true;
            }
            if (x.playerID === me.id) {
                // my own missile
                return false;
            }
            const missileShooter = env.getPlayer(x.playerID);
            if (!missileShooter) {
                return true;
            }
            return missileShooter.team !== myTeam;
        });
        return hostileMissiles;
    }
}