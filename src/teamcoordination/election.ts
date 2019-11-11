import { IAirmashEnvironment } from "../bot/airmash/iairmash-environment";
import { Calculations } from "../bot/calculations";
import { BotContext } from "../botContext";

export class Election {
    private existingLeaderId: number;
    private candidates: {};
    private chatSubscr: number;
    private electionResultResolver: (value?: number | PromiseLike<number>) => void;

    private get env(): IAirmashEnvironment {
        return this.context.env;
    }

    constructor(private context: BotContext) {
        this.chatSubscr = this.env.on('chat', x => this.onChat(x));
    }

    dispose() {
        this.env.off('chat', this.chatSubscr);
        this.electionResultResolver = null;
    }

    doElection(existingLeaderId: number): Promise<number> {
        this.existingLeaderId = existingLeaderId;
        this.env.sendTeam("Type #yes in the next 30 seconds if you want to be team leader. Type #vote <name> to vote for someone who is a candidate.", true);

        this.candidates = {};

        // const spatie = this.env.getPlayers().find(x => x.name === 'Spatie');
        // if (spatie) {
        //     this.candidates[spatie.id + ''] = 1;
        // }

        this.context.tm.setTimeout(() => this.endElection(), 30 * 1000);
        return new Promise((resolve) => {
            this.electionResultResolver = resolve;
        })
    }

    private onChat(ev: any) {

        const playerId = ev.id as number;
        const player = this.env.getPlayer(playerId);
        const message = ev.text;

        const me = this.env.me();

        if (player.team !== me.team) {
            return;
        }

        if (message === "#yes") {
            if (!this.candidates[playerId + '']) {
                this.candidates[playerId + ''] = 1;
                this.env.sendWhisper("Your vote has been counted", false, playerId);
            }
        } else {
            const m = /#vote\s(.+)$/.exec(message);
            if (m) {
                const name = m[1];
                const victim = this.env.getPlayers().find(x => x.name === name);
                if (victim && victim.id !== player.id) {
                    if (this.candidates[victim.id + '']) {
                        this.candidates[victim.id + '']++;
                        this.env.sendWhisper("Your vote for " + victim.name + " has been counted", false, playerId);
                    }
                }
            }
        }
    }

    private endElection() {
        let ids = Object.keys(this.candidates);

        if (this.existingLeaderId && ids.length === 0) {
            ids.push(this.existingLeaderId + '');
        }

        const me = this.env.me();

        // remove inactive players
        ids = ids.filter(x => {
            const player = this.env.getPlayer(Number(x));
            return player && !player.isHidden && player.team === me.team;
        });

        if (ids.length === 0) {
            const allTeamPlayers = this.env.getPlayers().filter(x => x.team === me.team && !x.isHidden);
            ids = allTeamPlayers
                .filter(x => x.id !== me.id) // don't choose myself, because server frowns upon my spamming if i'm both instructing and answering.
                .map(x => '' + x.id);

            for (let i = 0; i < ids.length; i++) {
                this.candidates[ids[i]] = 1;
            }
        }

        let highestVotes = 0;
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            if (this.candidates[id] > highestVotes) {
                highestVotes = this.candidates[id];
            }
        }

        const topCandidates = [];
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            if (this.candidates[id] === highestVotes) {
                topCandidates.push(Number(id));
            }
        }

        if (topCandidates.length > 0) {
            const newLeaderId = topCandidates[Calculations.getRandomInt(0, topCandidates.length)];

            const winner = this.env.getPlayer(newLeaderId);
            this.electionResultResolver(Number(newLeaderId));
            if (newLeaderId !== this.existingLeaderId) {
                this.env.sendTeam(winner.name + " has been chosen as the new team leader.", true);
            } else {
                this.env.sendTeam(winner.name + " is still the team leader.", true);
            }
        } else {
            this.electionResultResolver(null);
        }

        this.dispose();
    }
}