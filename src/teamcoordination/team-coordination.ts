import { IAirmashEnvironment } from "../bot/airmash/iairmash-environment";
import { StopWatch } from "../helper/timer";
import { PlayerInfo } from "../bot/airmash/player-info";
import { Election } from "./election";
import { Slave } from "./slave";
import { Logger } from "../helper/logger";
import { TeamLeaderChatHelper } from "../helper/teamleader-chat-helper";
import { ChallengeLeader } from "./challenge-leader";
import { BotContext } from "../bot/botContext";

const ELECTION_TIMEOUT_MINUTES = 10;
const LEADER_CHALLENGABLE_MINUTES = 2.5;

let teamCoordinatorRed: number;
let teamCoordinatorBlue: number;
const slaves: Slave[] = [];

function stopGame() {
    teamCoordinatorBlue = null;
    teamCoordinatorRed = null;
}

function startGame(bot: PlayerInfo) {
    if (bot.team === 1 && !teamCoordinatorBlue) {
        teamCoordinatorBlue = bot.id;
        return true;
    } else if (bot.team === 2 && !teamCoordinatorRed) {
        teamCoordinatorRed = bot.id;
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
    private leaderChallengeTimer = new StopWatch();

    private teamLeaderId: number;
    private isTeamCoordinatorBot: boolean;
    private isElectionOngoing: boolean;
    private lastSaid: string;

    private chatSubscription: number;
    private startSubscription: number;
    private ctgGameOverSubscription: number;
    private serverMessageSubscription: number;
    private tickSubscription: number;

    private get env(): IAirmashEnvironment {
        return this.context.env;
    }

    private get logger(): Logger {
        return this.context.logger;
    }

    constructor(private context: BotContext, private isSecondaryTeamCoordinator: boolean) {
        this.chatSubscription = this.env.on('chat', x => this.onChat(x));
        this.startSubscription = this.env.on('start', _ => this.onStart());
        this.ctgGameOverSubscription = this.env.on('ctfGameOver', () => this.onStop());
        this.serverMessageSubscription = this.env.on('serverMessage', (x) => this.onServerMessage(x.text as string));
        this.tickSubscription = this.env.on('tick', () => this.onTick());
    }

    addSlave(s: Slave) {
        slaves.push(s);
    }

    private onTick() {
        if (!this.isTeamCoordinatorBot) {
            return;
        }
        if (this.isElectionOngoing) {
            return;
        }
        if (this.tickStopwatch.isStarted && this.tickStopwatch.elapsedSeconds() <= 1) {
            return;
        }

        const teamLeader = this.env.getPlayer(this.teamLeaderId);
        if (!teamLeader || this.nextElectionStopwatch.elapsedMinutes() > ELECTION_TIMEOUT_MINUTES) {
            this.electLeader();
        }

        this.tickStopwatch.start();
    }

    private onStart() {
        const me = this.env.me();
        if (!me) {
            this.context.tm.setTimeout(() => this.onStart(), 500);
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
        this.isTeamCoordinatorBot = isLeader;
        if (this.isTeamCoordinatorBot) {
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
        this.isTeamCoordinatorBot = false;
    }

    private onServerMessage(text: string) {
        if (text.indexOf('shuffling teams') > -1) {
            this.context.tm.setTimeout(() => this.initialize(), 1000);
        }
    }

    private async electLeader() {
        if (this.isSecondaryTeamCoordinator) {
            // this team coordinator is a "silent one", that is, it will listen 
            // for someone to be appointed the leader, and then silently take over that selection
            // here. This allows for multiple sets of bots from different IPs, but it's not tamper-proof.
            return;
        }

        this.isElectionOngoing = true;
        const election = new Election(this.context);
        this.teamLeaderId = await election.doElection(this.teamLeaderId);
        this.nextElectionStopwatch.start();
        this.leaderChallengeTimer.start();
        this.isElectionOngoing = false;
    }

    private async challengeLeader() {
        if (this.isSecondaryTeamCoordinator) {
            return;
        }
        this.leaderChallengeTimer.start();

        const challenge = new ChallengeLeader(this.context);
        const needsNewElection = await challenge.challengeLeader(this.teamLeaderId);

        if (needsNewElection) {
            this.electLeader();
        }
    }

    private onChat(ev: any) {
        if (!this.isTeamCoordinatorBot) {
            return;
        }

        const playerId = ev.id as number;
        const player = this.env.getPlayer(playerId);
        const message = ev.text;

        const me = this.env.me();

        if (player.team !== me.team) {
            return;
        }

        if (this.isSecondaryTeamCoordinator) {
            const newTeamleaderID = TeamLeaderChatHelper.getTeamleaderId(ev.text, this.env);
            if (newTeamleaderID) {
                this.teamLeaderId = newTeamleaderID;
            }
        }

        const speakerIsTeamLeader = this.teamLeaderId === playerId;

        const ctfCommandMatch = /^\s*#([\w\-]+)(?:\s(.*))?$/.exec(message);
        if (ctfCommandMatch) {
            const command = ctfCommandMatch[1];
            const param = ctfCommandMatch[2];

            if (command === 'leader' && speakerIsTeamLeader) {
                const victim = this.env.getPlayers().find(x => x.name === param);
                // don't allow me to be leader: i will be banned for spam
                if (victim && victim.team === me.team && victim.id !== me.id) {
                    this.teamLeaderId = victim.id;
                    if (!this.isSecondaryTeamCoordinator) {
                        this.env.sendTeam(player.name + " has made " + victim.name + " the new team leader.", true);
                    }
                }
            }

            this.execCtfCommand(playerId, command, param, speakerIsTeamLeader);
        }
    }

    private execCtfCommand(playerId: number, command: string, param: string, speakerIsTeamLeader: boolean) {

        if (!speakerIsTeamLeader && command !== 'drop' && command !== 'challenge-leader') {
            // the only command non-teamleaders can issue, is 'drop' and 'challenge-leader'
            return;
        }

        const me = this.env.me();

        let shouldSay: string;

        switch (command) {
            case 'defend':
            case 'def':
            case 'recap':
            case 'recover':
                shouldSay = "defend mode enabled";
                break;

            case 'cap':
            case 'capture':
            case 'escort':
                shouldSay = "capture mode enabled";
                break;

            case 'auto':
                shouldSay = "auto mode enabled";
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
                    shouldSay = "assist mode enabled";
                    param = playerToAssist.id + '';
                }
                break;

            case 'challenge-leader':
                const canChallenge = this.leaderChallengeTimer.elapsedSeconds() > LEADER_CHALLENGABLE_MINUTES;
                const isAnElectionInSight = ELECTION_TIMEOUT_MINUTES - this.nextElectionStopwatch.elapsedMinutes() < 1;
                if (canChallenge && !isAnElectionInSight && this.teamLeaderId) {
                    this.challengeLeader();
                }
                break;
        }

        if (shouldSay && shouldSay !== this.lastSaid && !this.isSecondaryTeamCoordinator) {
            if (this.env.sendTeam(shouldSay, false)) {
                this.lastSaid = shouldSay;
            }
        }

        if (command === 'auto') {
            execAuto(playerId, me.team);
        } else {
            teamSlaves(me.team).forEach(x => x.execCtfCommand(playerId, command, param));
        }
    }
}