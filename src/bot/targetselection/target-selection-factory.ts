import { ITargetSelection } from "./itarget-selection";
import { CtfTargetSelection } from "./ctf-target-selection";
import { TargetSelection } from "./target-selection";
import { Slave } from "../../teamcoordination/slave";
import { BotContext } from "../botContext";

export class TargetSelectionFactory {
    static createTargetSelection(context: BotContext, slave: Slave): ITargetSelection {
        if (context.env.getGameType() === 2) {
            const ts = new CtfTargetSelection(context, slave);
            slave.setCtfTargetSelection(ts);
            return ts;
        }

        return new TargetSelection(context);
    }
}