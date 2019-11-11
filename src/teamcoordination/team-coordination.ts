import { IAirmashEnvironment } from "../bot/airmash/iairmash-environment";
import { StopWatch } from "../helper/timer";
import { PlayerInfo } from "../bot/airmash/player-info";
import { Election } from "./election";
import { Slave } from "./slave";
import { TeamLeaderChatHelper } from "../helper/teamleader-chat-helper";
import { ChallengeLeader } from "./challenge-leader";
import { BotContext } from "../botContext";
import { Calculations } from "../bot/calculations";

const ELECTION_TIMEOUT_MINUTES = 10;
const LEADER_CHALLENGABLE_MINUTES = 2.5;

let teamCoordinatorRed: number;
let teamCoordinatorBlue: number;
let teamLeaderRedId: number;
let teamLeaderBlueId: number;
let slaves: Slave[] = [];

function stopCoordination() {
    teamCoordinatorBlue = null;
    teamCoordinatorRed = null;
}

function chooseTeamCoordinator(bot: PlayerInfo) {
    if (bot.team === 1) {
        if (!teamCoordinatorBlue) {
            teamCoordinatorBlue = bot.id;
        }
        return teamCoordinatorBlue === bot.id;
    } else if (bot.team === 2) {
        if (!teamCoordinatorRed) {
            teamCoordinatorRed = bot.id;
        }
        return teamCoordinatorRed === bot.id;
    }
    return false;
}

function teamSlaves(team: number): Slave[] {
    return slaves.filter(x => x.getTeam() === team && x.isActive());
}

function execAuto(team: number) {
    const ts = teamSlaves(team);
    const slavesCount = ts.length;
    const attackers = slavesCount / 2 + 1; // try to have more attackers than defense

    for (let i = 0; i < slavesCount; i++) {
        ts[i].setDefaultRole(i < attackers ? "A" : "D");
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
    private gameIsAboutToStart: boolean;

    private get env(): IAirmashEnvironment {
        return this.context.env;
    }

    constructor(private context: BotContext, private isSecondaryTeamCoordinator: boolean) {
        this.env.on('chat', x => this.onChat(x));
        this.env.on('ctfGameOver', () => this.onGameOver());
        this.env.on('serverMessage', (x) => this.onServerMessage(x.text as string));
        this.env.on('tick', () => this.onTick());
    }

    addSlave(s: Slave) {
        slaves.push(s);
    }

    private onTick() {
        // alway reconsider being the teamcoordinator, because the teamcoordinator 
        // may have quit because of an error
        const me = this.env.me();

        if (!me) {
            return;
        }

        const ctfScores = this.env.getCtfScores();
        if (!ctfScores[1] && ctfScores[1] !== 0) {
            // scores not yet known
            return;
        }

        if ((ctfScores[1] === 3 || ctfScores[2] === 3) && !this.gameIsAboutToStart) {
            // game has not started yet, and is not about to start yet
            return;
        }

        const wasTeamCoordinator = this.isTeamCoordinatorBot;
        this.isTeamCoordinatorBot = chooseTeamCoordinator(me);
        if (!wasTeamCoordinator && this.isTeamCoordinatorBot) {
            // reset bots to auto when i'm the new bot coordinator
            execAuto(me.team);
            // also reset bot types to random
            this.selectAircraftTypes(me.team, 'random')
        }

        this.gameIsAboutToStart = false;

        if (!this.isTeamCoordinatorBot) {
            return;
        }
        if (this.isElectionOngoing) {
            return;
        }
        if (this.tickStopwatch.isStarted && this.tickStopwatch.elapsedSeconds() <= 1) {
            return;
        }

        if (teamSlaves(me.team).length < 2) {
            // it makes not sense to lead
            return;
        }

        const teamLeader = this.env.getPlayer(this.teamLeaderId);
        if (!teamLeader || teamLeader.team !== me.team || this.nextElectionStopwatch.elapsedMinutes() > ELECTION_TIMEOUT_MINUTES) {
            this.electLeader();
        }

        this.tickStopwatch.start();
    }

    private setTeamLeader(teamLeaderId: number) {
        this.teamLeaderId = teamLeaderId;

        const me = this.env.me();
        if (me.team === 1) {
            teamLeaderBlueId = this.teamLeaderId;
        } else {
            teamLeaderRedId = this.teamLeaderId;
        }
    }

    private onGameOver() {
        stopCoordination();
        this.isTeamCoordinatorBot = false;
        slaves.forEach(x => {
            if (x.isActive()) {
                x.restart();
            }
        });
        slaves = [];
    }

    stop() {
        if (this.isTeamCoordinatorBot) {
            // will be noticed by other bots, so the first one will take over leadership
            stopCoordination();
        }
    }

    private onServerMessage(text: string) {
        if (text.indexOf('shuffling teams') > -1) {
            this.context.tm.setTimeout(() => this.gameIsAboutToStart = true, 1000);
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
        const teamLeaderId = await election.doElection(this.teamLeaderId);
        this.setTeamLeader(teamLeaderId);

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

        if (!player || player.team !== me.team) {
            return;
        }

        if (this.isSecondaryTeamCoordinator) {
            const newTeamleaderID = TeamLeaderChatHelper.getTeamleaderId(ev.text, this.env);
            if (newTeamleaderID) {
                this.setTeamLeader(newTeamleaderID)
                return;
            }
        }

        const ctfCommandMatch = /^\s*#([\w\-]+)(?:\s(.*))?$/.exec(message);
        if (ctfCommandMatch) {
            const command = ctfCommandMatch[1];
            const param = ctfCommandMatch[2];

            this.execCtfCommand(player, command, param);
        }
    }

    private execCtfCommand(speaker: PlayerInfo, command: string, param: string) {

        const speakerIsTeamLeader = this.teamLeaderId === speaker.id;
        const nonTeamLeaderCommands = ['drop', 'f', 'challenge-leader', 'leader-challenge', 'status'];
        const isNonTeamLeaderCommand = nonTeamLeaderCommands.indexOf(command) > -1;
        if (!speakerIsTeamLeader && !isNonTeamLeaderCommand) {
            // the only command non-teamleaders can issue, is 'drop' (f) and 'challenge-leader'
            this.context.logger.debug("ignoring command " + command);
            return;
        }

        this.context.logger.info("received command " + command);

        const me = this.env.me();

        let shouldSay: string;

        switch (command) {
            case 'defend':
            case 'def':
            case 'recap':
            case 'recover':
            case 'd':
            case 'r':
                shouldSay = "defend mode enabled";
                command = 'defend';
                break;

            case 'cap':
            case 'capture':
            case 'escort':
            case 'c':
            case 'e':
                shouldSay = "capture mode enabled";
                command = 'capture';
                break;

            case 'auto':
                shouldSay = "auto mode enabled";
                break;

            case 'assist':
            case 'protect':
            case 'a':
            case 'p':
                command = 'assist';
                const targetPlayerName = param;
                let playerToAssist: PlayerInfo;
                if (targetPlayerName) {
                    if (targetPlayerName === 'me') {
                        playerToAssist = speaker;
                    } else {
                        playerToAssist = this.env.getPlayers().find(x => x.name && x.name.toLowerCase() === targetPlayerName.toLowerCase());
                    }

                    if (playerToAssist && playerToAssist.team === me.team) {
                        shouldSay = "assist mode enabled";
                        param = playerToAssist.id + '';
                    }
                }
                break;

            case 'drop':
            case 'f':
                command = 'drop';
                break;

            case 'help':
                shouldSay = "https://github.com/spatiebot/ab-bot#commands";
                break;

            case 'leader':
                const victim = this.env.getPlayers().find(x => x.name === param);
                // don't allow me to be leader: i will be banned for spam
                if (victim && victim.team === me.team && victim.id !== me.id) {
                    this.setTeamLeader(victim.id);
                    if (!this.isSecondaryTeamCoordinator) {
                        this.env.sendTeam(speaker.name + " has made " + victim.name + " the new team leader.", true);
                    }
                }
                break;

            case 'leader-challenge':
            case 'challenge-leader':
                const canChallenge = this.leaderChallengeTimer.elapsedSeconds() > LEADER_CHALLENGABLE_MINUTES;
                const isAnElectionInSight = ELECTION_TIMEOUT_MINUTES - this.nextElectionStopwatch.elapsedMinutes() < 1;
                if (canChallenge && !isAnElectionInSight && this.teamLeaderId) {
                    this.challengeLeader();
                }
                break;

            case 'status':
                this.showStatus(me.team);
                break;


            case 'type':
                this.selectAircraftTypes(me.team, param);

                break;
        }

        if (shouldSay && shouldSay !== this.lastSaid && !this.isSecondaryTeamCoordinator) {
            if (this.env.sendTeam(shouldSay, false)) {
                this.lastSaid = shouldSay;
            }
        }

        if (command === 'auto') {
            execAuto(me.team);
        } else {
            teamSlaves(me.team).forEach(x => x.execCtfCommand(speaker.id, command, param));
        }
    }

    private showStatus(myTeam: number) {
        const blueSlaves = teamSlaves(1);
        const redSlaves = teamSlaves(2);
        const slaveIds = slaves.map(x => x.id);
        const redLeader = this.env.getPlayer(teamLeaderRedId);
        const blueLeader = this.env.getPlayer(teamLeaderBlueId);
        const allPlayers = this.env.getPlayers().filter(x => slaveIds.indexOf(x.id) === -1);
        const redPlayers = allPlayers.filter(x => x.team === 2);
        const bluePlayers = allPlayers.filter(x => x.team === 1);
        const inactiveRedPlayers = redPlayers.filter(x => x.isHidden);
        const inactiveBluePlayers = bluePlayers.filter(x => x.isHidden);
        const blueInactiveText = inactiveBluePlayers.length > 0 ? ` (of which ${inactiveBluePlayers.length} not active)` : "";
        const blueText = `Blue has ${bluePlayers.length} players${blueInactiveText}, and ${blueSlaves.length} bots
                     managed by ${blueLeader ? blueLeader.name : 'no one'}.`;
        const redInactiveText = inactiveRedPlayers.length > 0 ? ` (of which ${inactiveRedPlayers.length} not active)` : "";
        const redText = `Red has ${redPlayers.length} players${redInactiveText}, and ${redSlaves.length} bots
                          managed by ${redLeader ? redLeader.name : 'no one'}.`;
        const firstText = myTeam === 1 ? blueText : redText;
        const secondText = myTeam === 1 ? redText : blueText;
        this.env.sendChat(firstText, false);
        this.context.tm.setTimeout(() => this.env.sendChat(secondText, false), 1200);
    }

    private selectAircraftTypes(team: number, typeSpec: string) {
        let type = 0;
        teamSlaves(team).forEach(s => {
            let planeType = Number(typeSpec);
            if (!planeType) {
                if (typeSpec === 'distribute' || typeSpec === 'd') {
                    type++;
                    if (type > 5) {
                        type = 1;
                    }
                    planeType = type;
                }
                else {
                    planeType = Calculations.getRandomInt(1, 6);
                }
            }
            s.switchTo(planeType);
        });
    }
}