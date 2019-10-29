import { IAirmashEnvironment } from "../bot/airmash/iairmash-environment";
import { StopWatch } from "../helper/timer";
import { PlayerInfo } from "../bot/airmash/player-info";
import { Election } from "./election";
import { Slave } from "./slave";
import { logger } from "../helper/logger";

let leaderRed: number;
let leaderBlue: number;
let slaves: Slave[] = [];

function stopGame() {
    leaderBlue = null;
    leaderRed = null;
}

function startGame(bot: PlayerInfo) {
    if (bot.team === 1 && !leaderBlue) {
        leaderBlue = bot.id;
        return true;
    } else if (bot.team === 2 && !leaderRed) {
        leaderRed = bot.id;
        return true;
    }
    return false;
}

export class TeamCoordination {
    private nextElectionStopwatch = new StopWatch();

    private teamLeaderId: number;
    private isBotLeader: boolean;

    constructor(private env: IAirmashEnvironment) {
        this.env.on('chat', x => this.onChat(x));
        this.env.on('start', _ => this.onStart());
        this.env.on('ctfGameOver', () => stopGame());
    }

    addSlave(s: Slave) {
        slaves.push(s);
    }

    private async onStart() {
        const me = this.env.me();
        if (!me) {
            setTimeout(() => this.onStart(), 500);
            return;
        }

        if (this.env.getGameType() !== 2) {
            return;
        }

        const isLeader = startGame(me);
        this.isBotLeader = isLeader;
        if (this.isBotLeader) {
            const election = new Election(this.env);
            this.teamLeaderId = await election.doElection();
        }
    }

    private onChat(ev: any) {
        if (!this.isBotLeader) {
            return;
        }

        const playerId = ev.id as number;
        const player = this.env.getPlayer(playerId);
        const message = ev.text;

        const me = this.env.me();

        if (player.team !== me.team) {
            return;
        }

        if (this.isBotLeader) {
            logger.warn("botleaderCommand", { teamLeader: this.teamLeaderId, playerId });
        }

        if (this.teamLeaderId === playerId) {

            const ctfCommandMatch = /^\s*#(\w+)(?:\s(.*))?$/.exec(message);
            if (ctfCommandMatch) {
                const command = ctfCommandMatch[1];
                const param = ctfCommandMatch[2];

                if (command === 'leader') {
                    const victim = this.env.getPlayers().find(x => x.name === param);
                    if (victim && victim.team === me.team) {
                        this.teamLeaderId = victim.id;
                        this.env.sendTeam(player.name + " has made " + victim.name + " the new team leader.");
                    }
                }

                this.execCtfCommand(playerId, command, param);
            }

        }
    }

    private execCtfCommand(playerId: number, command: string, param: string) {
        switch (command) {

            case 'defend':
            case 'def':
                this.env.sendTeam("defend mode enabled");
                break;

            case 'cap':
            case 'capture':
            case 'escort':
                this.env.sendTeam("capture mode enabled");
                break;

            case 'auto':
                this.env.sendTeam("auto mode enabled");
                break;

            case 'assist':
                const speaker = this.env.getPlayer(playerId);
                const me = this.env.me();

                const targetPlayerName = param;
                let playerToAssist: PlayerInfo;
                if (targetPlayerName === 'me') {
                    playerToAssist = speaker;
                } else {
                    playerToAssist = this.env.getPlayers().find(x => x.name.toLowerCase() === targetPlayerName.toLowerCase())
                }

                if (playerToAssist && playerToAssist.team === me.team) {
                    this.env.sendTeam("assist mode enabled");
                    param = playerToAssist.id + '';
                }
        }

        slaves.forEach(x => x.execCtfCommand(playerId, command, param));
    }
}