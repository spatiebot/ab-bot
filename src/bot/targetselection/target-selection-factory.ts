import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { BotCharacter } from "../bot-character";
import { ITargetSelection } from "./itarget-selection";
import { CtfTargetSelection } from "./ctf-target-selection";
import { TargetSelection } from "./target-selection";

export class TargetSelectionFactory {
    static createTargetSelection(env: IAirmashEnvironment, character:BotCharacter) : ITargetSelection {
        if (env.getGameType() === 2) {
            return new CtfTargetSelection(env, character);
        }

        return new TargetSelection(env, character);
    }
}