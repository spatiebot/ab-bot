import { IAirmashEnvironment } from "../bot/airmash/iairmash-environment";
import { Calculations } from "../bot/calculations";
import { BotContext } from "../botContext";

export class ChallengeLeader {
    private existingLeaderId: number;
    private chatSubscr: number;
    private challengeResolver: (value?: boolean | PromiseLike<boolean>) => void;
    private timeoutId;

    private get env(): IAirmashEnvironment {
        return this.context.env;
    }

    constructor(private context: BotContext) {
        this.chatSubscr = this.env.on('chat', x => this.onChat(x));
    }

    dispose() {
        this.env.off('chat', this.chatSubscr);
        this.challengeResolver = null;
    }

    challengeLeader(existingLeaderId: number): Promise<boolean> {
        this.existingLeaderId = existingLeaderId;

        const player = this.env.getPlayer(this.existingLeaderId);
        let name = 'Leader';
        if (player) {
            name = player.name;
        }
        this.env.sendTeam("Leader challenge! @" + name + ", say 'x' in the chat in the next 30 seconds to keep your leadership.", true);

        this.timeoutId = this.context.tm.setTimeout(() => this.endChallenge(true), 30 * 1000);
        return new Promise((resolve) => {
            this.challengeResolver = resolve;
        })
    }

    private onChat(ev: any) {

        const playerId = ev.id as number;
        const player = this.env.getPlayer(playerId);
        const message = ev.text;

        if (player.id === this.existingLeaderId && message === 'x') {
            this.endChallenge(false);
        }
    }

    private endChallenge(needsNewLeader: boolean) {
        this.context.tm.clearTimeout(this.timeoutId);
        this.challengeResolver(needsNewLeader);
        this.dispose();
    }
}