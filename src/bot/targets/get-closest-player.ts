import { PlayerInfo } from "../airmash/player-info";
import { IAirmashEnvironment } from "../airmash/iairmash-environment";
import { Calculations } from "../calculations";
import { Pos } from "../pos";

class Result {
    player: PlayerInfo;
    delta: {
        diffX: number;
        diffY: number;
        distance: number;
    };
}

function getPlayersSortedByDistance(env: IAirmashEnvironment, excludeHidden = false, pos: Pos = null): Result[] {
    const me = env.me();
    pos = pos || me.pos;

    const allPlayers = env.getPlayers();
    const players = allPlayers.filter(x => x.id !== me.id &&
        (!excludeHidden || !x.isHidden && !x.isStealthed));

    const list: Result[] = [];
    for (let i = 0; i < players.length; i++) {
        const p = players[i];
        const delta = Calculations.getDelta(pos, PlayerInfo.getMostReliablePos(p));
        if (!delta) {
            continue;
        }
        list.push({
            delta: delta,
            player: p
        });
    }

    list.sort((a, b) => {
        if (a.delta.distance < b.delta.distance) {
            return -1;
        } else if (a.delta.distance > b.delta.distance) {
            return 1;
        }
        return 0;
    });

    return list;
}

function getClosestPlayer(env: IAirmashEnvironment, excludeHidden = false): Result {
    const list = getPlayersSortedByDistance(env, excludeHidden);
    return list[0];
}

export { getPlayersSortedByDistance, getClosestPlayer }