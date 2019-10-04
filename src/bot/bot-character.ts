export class BotCharacter {
    static Default: BotCharacter = {
        name: 'Default',
        firingRange: 600,
        intimateRange: 250,
        predictPositions: false,
        goal: 'stealCrates',
        missileDistance: 100,
        otherAircraftDistance: 10,
        fleeHealth: 0.7,
        type: 0 // any
    };

    static Aggressive: BotCharacter = {
        ...BotCharacter.Default,
        name: 'Aggressive',
        predictPositions: true,
        goal: 'fight',
        missileDistance: 100,
        otherAircraftDistance: 10,
        fleeHealth: 0.4,
        type: 0 // any
    };

    static Shy: BotCharacter = {
        ...BotCharacter.Default,
        name: 'Shy',
        firingRange: 500,
        intimateRange: 300,
        predictPositions: false,
        goal: 'nothing',
        missileDistance: 300,
        otherAircraftDistance: 300
    }

    static Mohawk: BotCharacter = {
        ...BotCharacter.Default,
        name: 'Mohawk',
        firingRange: 1000, // always fires
        intimateRange: 500,
        missileDistance: 400,
        otherAircraftDistance: 200,
        fleeHealth: 0.8,
        type: 3
    }

    static Goli: BotCharacter = {
        ...BotCharacter.Default,
        name: 'Goli',
        intimateRange: 500,
        otherAircraftDistance: 200,
        fleeHealth: 0.8, // it takes some time to turn
        type: 2
    }

    static CrateStealer: BotCharacter = {
        ...BotCharacter.Shy,
        missileDistance: 200,
        otherAircraftDistance: 150,
        name: 'CrateStealer',
        goal: 'stealCrates'
    }

    static get(type: number): BotCharacter {
        switch (type) {
            case 2:
                return BotCharacter.Goli;
            case 3:
                return BotCharacter.Mohawk;
            default:
                return BotCharacter.Default;
        }
    }

    name: string;
    firingRange: number;
    intimateRange: number;
    predictPositions: boolean;
    goal: string;
    type: number;
    missileDistance: number;
    otherAircraftDistance: number;
    fleeHealth: number;
}