import { IAirmashEnvironment } from "../bot/airmash/iairmash-environment";
import { StopWatch } from "../helper/timer";
import { PlayerInfo } from "../bot/airmash/player-info";
import { Election } from "./election";
import { Slave } from "./slave";
import { Logger } from "../helper/logger";

let leaderRed: number;
let leaderBlue: number;
const slaves: Slave[] = [];

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

function teamSlaves(team: number): Slave[] {
    return slaves.filter(x => x.getTeam() === team);
}

function execAuto(playerId: number, team: number) {
    const ts = teamSlaves(team);
    const slavesCount = ts.length;
    const attackers = slavesCount / 2 + 1; // try to have more attackers than defense

    for (let i = 0; i < slavesCount; i++) {
        ts[i].execCtfCommand(playerId, "auto", i < attackers ? "A" : "D");
    }
}

export class TeamCoordination {
    private nextElectionStopwatch = new StopWatch();
    private tickStopwatch = new StopWatch();

    private teamLeaderId: number;
    private isBotLeader: boolean;
    private isElectionOngoing: boolean;

    constructor(private env: IAirmashEnvironment, private logger: Logger) {
        this.env.on('chat', x => this.onChat(x));
        this.env.on('start', _ => this.onStart());
        this.env.on('ctfGameOver', () => this.onStop());
        this.env.on('serverMessage', (x) => this.onServerMessage(x.text as string));
        this.env.on('tick', () => this.onTick());
    }

    addSlave(s: Slave) {
        slaves.push(s);
    }

    private onTick() {
        if (!this.isBotLeader) {
            return;
        }
        if (this.isElectionOngoing) {
            return;
        }
        if (this.tickStopwatch.isStarted && this.tickStopwatch.elapsedSeconds() <= 1) {
            return;
        }

        const teamLeader = this.env.getPlayer(this.teamLeaderId);
        if (!teamLeader || this.nextElectionStopwatch.elapsedMinutes() > 15) {
            this.electLeader();
        }

        this.tickStopwatch.start();
    }

    private onStart() {
        const me = this.env.me();
        if (!me) {
            setTimeout(() => this.onStart(), 500);
            return;
        }

        if (this.env.getGameType() !== 2) {
            return;
        }

        this.initialize();
    }

    private async initialize() {
        const me = this.env.me();
        const isLeader = startGame(me);
        this.isBotLeader = isLeader;
        if (this.isBotLeader) {
            await this.electLeader();
            try {
                execAuto(me.id, me.team);
            } catch (error) {
                this.logger.error("error #auto-ing", error);
            }
        }
    }

    private onStop() {
        stopGame();
        this.isBotLeader = false;
    }

    private onServerMessage(text: string) {
        if (text.indexOf('shuffling teams') > -1) {
            setTimeout(() => this.initialize(), 1000);
        }
    }

    private async electLeader() {
        this.isElectionOngoing = true;
        const election = new Election(this.env);
        this.teamLeaderId = await election.doElection(this.teamLeaderId);
        this.nextElectionStopwatch.start();
        this.isElectionOngoing = false;
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

        const speakerIsTeamLeader = this.teamLeaderId === playerId;

        const ctfCommandMatch = /^\s*#(\w+)(?:\s(.*))?$/.exec(message);
        if (ctfCommandMatch) {
            const command = ctfCommandMatch[1];
            const param = ctfCommandMatch[2];

            if (command === 'leader' && speakerIsTeamLeader) {
                const victim = this.env.getPlayers().find(x => x.name === param);
                // don't allow me to be leader: i will be banned for spam
                if (victim && victim.team === me.team && victim.id !== me.id) {
                    this.teamLeaderId = victim.id;
                    this.env.sendTeam(player.name + " has made " + victim.name + " the new team leader.");
                }
            }

            this.execCtfCommand(playerId, command, param, speakerIsTeamLeader);
        }
    }

    private execCtfCommand(playerId: number, command: string, param: string, speakerIsTeamLeader: boolean) {

        if (!speakerIsTeamLeader && command !== 'drop') {
            // the only command non-teamleaders can issue, is 'drop'
            return;
        }

        const me = this.env.me();

        switch (command) {
            case 'log':
                const botName = param;
                const bot = this.env.getPlayers().find(x => x.name.toLowerCase() === botName.toLowerCase());
                param = !!bot ? bot.id +'' : '';
                this.logger.warn("Log", {botName, param});
                break;

            case 'defend':
            case 'def':
            case 'recap':
            case 'recover':
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
            case 'protect':
                const speaker = this.env.getPlayer(playerId);

                const targetPlayerName = param;
                let playerToAssist: PlayerInfo;
                if (targetPlayerName === 'me') {
                    playerToAssist = speaker;
                } else {
                    playerToAssist = this.env.getPlayers().find(x => x.name.toLowerCase() === targetPlayerName.toLowerCase());
                }

                if (playerToAssist && playerToAssist.team === me.team) {
                    this.env.sendTeam("assist mode enabled");
                    param = playerToAssist.id + '';
                }
        }

        if (command === 'auto') {
            execAuto(playerId, me.team);
        } else {
            teamSlaves(me.team).forEach(x => x.execCtfCommand(playerId, command, param));
        }
    }
}