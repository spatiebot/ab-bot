import { CtfTargetSelection } from "../bot/targetselection/ctf-target-selection";

export class Slave {
    private targetSelection: CtfTargetSelection;

    setCtfTargetSelection(ts: CtfTargetSelection) {
        this.targetSelection = ts;
    }

    execCtfCommand(playerId: number, command: string, param: string) {
        if (this.targetSelection) {
            this.targetSelection.execCtfCommand(playerId, command, param);
        }
    }
}