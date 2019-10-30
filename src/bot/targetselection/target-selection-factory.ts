import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { BotCharacter } from "../bot-character";
import { ITargetSelection } from "./itarget-selection";
import { CtfTargetSelection } from "./ctf-target-selection";
import { TargetSelection } from "./target-selection";
import { Slave } from "../../teamcoordination/slave";
import { AirmashBot } from "../airmash-bot";
import { Logger } from "../../helper/logger";

export class TargetSelectionFactory {
    static createTargetSelection(env: IAirmashEnvironment, logger: Logger, character: BotCharacter, slave: Slave, bot: AirmashBot): ITargetSelection {
        if (env.getGameType() === 2) {
            const ts = new CtfTargetSelection(env, logger, character, bot, slave);
            slave.setCtfTargetSelection(ts);
            return ts;
        }

        return new TargetSelection(env, logger, character);
    }
}