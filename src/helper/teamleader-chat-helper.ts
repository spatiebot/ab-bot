import { IAirmashEnvironment } from "../bot/airmash/iairmash-environment";

export class TeamLeaderChatHelper {
    static getTeamleaderId(chatMessage: string, env: IAirmashEnvironment): number {
        // ... has been chosen as the new team leader.
        // ... is still the team leader.
        //     has made ... the new team leader
        let teamLeaderMatch = /^(.*)\s(?:has\sbeen\schosen\sas\sthe\snew|is\sstill\sthe)\steam\sleader\./.exec(chatMessage);
        if (!teamLeaderMatch) {
            teamLeaderMatch = /has\smade\s(.*)\sthe\snew\steam\sleader./.exec(chatMessage);
        }
        if (teamLeaderMatch) {
            const newTeamLeaderName = teamLeaderMatch[1];
            const player = env.getPlayers().find(x => x.name === newTeamLeaderName);
            if (player) {
                return player.id;
            }
        }
        return null;
    }
}