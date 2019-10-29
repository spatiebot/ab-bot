import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { BotCharacter } from "../bot-character";
import { ITargetSelection } from "./itarget-selection";
import { CtfTargetSelection } from "./ctf-target-selection";
import { TargetSelection } from "./target-selection";
import { Slave } from "../../teamcoordination/slave";

export class TargetSelectionFactory {
    static createTargetSelection(env: IAirmashEnvironment, character: BotCharacter, slave: Slave): ITargetSelection {
        if (env.getGameType() === 2) {
            var ts = new CtfTargetSelection(env, character);
            slave.setCtfTargetSelection(ts);
            return ts;
        }

        return new TargetSelection(env, character);
    }
}