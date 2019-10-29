import { IAirmashEnvironment } from "./airmash/iairmash-environment";
import { Pos } from "./pos";
import { StopWatch } from "../helper/timer";

const blueFlagPos = new Pos({ x: -9670, y: -1470 });
const redFlagPos = new Pos({ x: 8600, y: -940 });
const blueAssistLine = 6000;
const redAssistLine = -7000;
const centerLine = 500;

export class TeamLeader {
    private leadTimer = new StopWatch();
    private assistID: number;
    private lastSaid = "";

    constructor(private env: IAirmashEnvironment) {
        this.leadTimer.start();
    }

    lead() {

        if (this.leadTimer.elapsedMs() < 1000) {
            return;
        }

        this.leadTimer.start();

        const me = this.env.me();
        const otherTeam = me.team === 1 ? 2 : 1;

        const myFlagInfo = this.env.getFlagInfo(me.team);
        const otherFlagInfo = this.env.getFlagInfo(otherTeam);

        const defaultMyFlagPos = me.team === 1 ? blueFlagPos : redFlagPos;
        const defaultOtherFlagPos = me.team === 1 ? redFlagPos : blueFlagPos;

        const myScore = this.env.getCtfScores[me.team];
        const otherScore = this.env.getCtfScores[otherTeam];

        let shouldSay;

        const myFlagTaken = myFlagInfo.carrierId || (myFlagInfo.pos.x !== defaultMyFlagPos.x && myFlagInfo.pos.y !== defaultMyFlagPos.y);
        const otherFlagTaken = !!otherFlagInfo.carrierId;
        if (myFlagTaken && (otherFlagTaken && otherScore === 2 || !otherFlagTaken)) {
            shouldSay = "#recover";
        }

        if (!shouldSay && otherFlagTaken) {
            const carrier = this.env.getPlayer(otherFlagInfo.carrierId);
            if (carrier) {
                shouldSay = "#assist " + carrier.name;
            }
        }

        if (!shouldSay) {
            const isOverAssistLine = (pos: Pos) => {
                if (!pos) {
                    return false;
                }
                if (me.team === 1) {
                    return pos.x > blueAssistLine;
                }
                return pos.x < redAssistLine;
            };
            const isAttacking = (pos: Pos) => {
                if (!pos) {
                    return false;
                }
                if (me.team === 1) {
                    return pos.x > centerLine;
                }
                return pos.x < centerLine;
            }

            if (this.assistID) {
                const assistPlayer = this.env.getPlayer(this.assistID);
                if (assistPlayer) {
                    if (isOverAssistLine(assistPlayer.pos)) {
                        // no action needed
                        return;
                    }
                }
            }

            const allPlayers = this.env.getPlayers();
            const attackingPlayers = allPlayers
                .filter(x => !x.isStealthed && !x.isHidden)
                .filter(x => x.team === me.team && isAttacking(x.pos));

            attackingPlayers.sort((a, b) => a.pos.x - b.pos.x);

            const firstPlayer = attackingPlayers[0];
            if (firstPlayer) {
                shouldSay = "#assist " + firstPlayer.name;

                if (isOverAssistLine(firstPlayer.pos)) {
                    this.assistID = firstPlayer.id;
                }
            }
        }

        if (!shouldSay) {
            shouldSay = "#capture"
        }

        if (this.lastSaid !== shouldSay) {
            this.env.sendTeam(shouldSay);
            this.lastSaid = shouldSay;
        }
    }

}