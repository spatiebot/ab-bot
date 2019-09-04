import { BotCommand } from "../bot-command";

export class PoopState {

    upgradesDroppedTime: number = 0;
    poopyPlayerID: number;
    lastPlayerID: number;
    openForPoopCommandsSince: number;
    confirmedPlayerSince: number;

    onChat(playerID: any, text: any) {
        if (!this.openForPoopCommandsSince) {
            return;
        }

        if (text === '#poop me') {
            this.poopyPlayerID = playerID;
            this.openForPoopCommandsSince = null;
        }
    }

    reset() {
        this.poopyPlayerID = null;
        this.lastPlayerID = null;
        this.openForPoopCommandsSince = null;
        this.confirmedPlayerSince = null;
    }
    droppedPoop() {
        const id = this.poopyPlayerID;
        this.reset();
        this.upgradesDroppedTime = Date.now();
        this.lastPlayerID = id;
    }

    openForPoopCommandsTimeout(): boolean {
        return Date.now() - this.openForPoopCommandsSince > 1000 * 60 * 2;
    }

    confirmedPlayerTimeout(): boolean {
        return Date.now() - this.confirmedPlayerSince > 1000 * 60 * 2;
    }
}