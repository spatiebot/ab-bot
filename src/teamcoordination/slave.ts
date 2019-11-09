import { CtfTargetSelection } from "../bot/targetselection/ctf-target-selection";
import { IAirmashEnvironment } from "../bot/airmash/iairmash-environment";
import { Calculations } from "../bot/calculations";

export class Slave {
    private targetSelection: CtfTargetSelection;
    private lastCommand: string;
    private lastParam: string;
    private lastPlayerId: number;
    private myDefaultRole: string;

    constructor(private env: IAirmashEnvironment) {
    }

    getTeam(): number {
        const me = this.env.me();
        if (!me) {
            return 0;
        }
        return me.team;
    }

    getDefaultRole(): string {
        if (this.myDefaultRole) {
            return this.myDefaultRole;
        }
        const dieCast = Calculations.getRandomInt(1, 3);
        this.myDefaultRole = dieCast === 1 ? "A" : "D";
    }

    setDefaultRole(value: string) {
        this.myDefaultRole = value;
        if (this.targetSelection) {
            this.targetSelection.selectRole();
        }
    }

    setCtfTargetSelection(ts: CtfTargetSelection) {
        this.targetSelection = ts;
    }

    execCtfCommand(playerId: number, command: string, param: string) {
        this.lastPlayerId = playerId;
        this.lastCommand = command;
        this.lastParam = param;
        if (this.targetSelection) {
            this.targetSelection.execCtfCommand(playerId, command, param);
        }
    }

    repeatLastCommand() {
        if (this.lastCommand && this.lastCommand !== 'drop' && this.lastCommand !== 'type') {
            this.execCtfCommand(this.lastPlayerId, this.lastCommand, this.lastParam);
        }
    }
}