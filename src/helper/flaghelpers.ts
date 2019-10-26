import { IAirmashEnvironment } from "../bot/airmash/iairmash-environment";

export class FlagHelpers {
    static isCarryingFlag(env: IAirmashEnvironment): boolean {
        let isCarryingFlag = false;
        if (env.getGameType() === 2) {
            const me = env.me();
            const otherFlag = env.getFlagInfo(me.team === 1 ? 2 : 1);
            isCarryingFlag = otherFlag.carrierId === me.id;
        }

        return isCarryingFlag;
    }
}