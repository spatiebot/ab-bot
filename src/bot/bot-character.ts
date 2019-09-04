export class BotCharacter {
    static Default: BotCharacter = {
        firingRange: 600,
        intimateRange: 300,
        predictPositions: false,
        goal: 'fight',
        missileDistance: 120,
        otherAircraftDistance: 120,
        fleeHealth: 0.6,
        type: 0 // any
    };

    static Mohawk: BotCharacter = {
        ...BotCharacter.Default,
        firingRange: 1000, // always fires
        intimateRange: 500,
        missileDistance: 400,
        otherAircraftDistance: 300,
        fleeHealth: 0.8,
        type: 3
    }

    static CrateStealer: BotCharacter = {
        ...BotCharacter.Mohawk,
        goal: 'stealCrates'
    }

    static get(type: number): BotCharacter {
        switch (type) {
            case 3:
                return BotCharacter.Mohawk;
            default:
                return BotCharacter.Default;
        }
    }

    firingRange: number;
    intimateRange: number;
    predictPositions: boolean;
    goal: string;
    type: number;
    missileDistance: number;
    otherAircraftDistance: number;
    fleeHealth: number;
}