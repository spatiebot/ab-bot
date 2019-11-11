import { CtfTargetSelection } from "../bot/targetselection/ctf-target-selection";
import { Calculations } from "../bot/calculations";
import { BotContext } from "../botContext";

export class Slave {
    private targetSelection: CtfTargetSelection;
    private lastCommand: string;
    private lastParam: string;
    private lastPlayerId: number;
    private myDefaultRole: string;
    private isDeactivated: boolean;

    public get id(): number {
        return this.context.env.myId();
    }

    constructor(private context: BotContext) {
    }

    getTeam(): number {
        const me = this.context.env.me();
        if (!me) {
            return 0;
        }
        return me.team;
    }

    stop() {
        this.isDeactivated = true;
    }

    isActive(): boolean {
        if (this.isDeactivated) {
            return false;
        }
        const me = this.context.env.me();
        return !!me;
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

    restart(): void {
        this.context.rebootBot();
    }

    switchTo(aircraftType: number): void {
        this.context.bot.switchTo(aircraftType);
    }

}