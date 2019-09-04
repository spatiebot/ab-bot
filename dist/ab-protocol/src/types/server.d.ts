export declare enum SERVER_ERRORS {
    PACKET_FLOODING_DISCONNECT = 1,
    PACKET_FLOODING_BAN = 2,
    GLOBAL_BAN = 3,
    UNKNOWN_ERROR = 4,
    REQUIRED_INACTIVITY_AND_HEALTH_TO_RESPAWN = 5,
    AFK_DISCONNECT = 6,
    PLAYER_KICKED = 7,
    INVALID_LOGIN_DATA = 8,
    INCORRECT_PROTOCOL = 9,
    ACCOUNT_BANNED = 10,
    ALREADY_LOGGED_IN = 11,
    FORBIDDEN_TO_CHANGE_PLANE_IN_BTR = 12,
    REQUIRED_INACTIVITY_AND_HEALTH_TO_SPECTATE = 13,
    NOT_ENOUGH_UPGRADES = 20,
    CHAT_SPAMMING = 30,
    FLAG_CHANGE_TOO_FAST = 31,
    UNKNOWN_COMMAND = 100
}
export declare enum SERVER_MESSAGE_TYPES {
    ALERT = 1,
    INFO = 2
}
export declare enum COMMAND_REPLY_TYPES {
    CHAT = 0,
    DEBUG = 1
}
export declare enum LEAVE_HORIZON_TYPES {
    PLAYER = 0,
    MOB = 1
}
export declare enum MOB_TYPES {
    PLAYER = 0,
    PREDATOR_MISSILE = 1,
    GOLIATH_MISSILE = 2,
    COPTER_MISSILE = 3,
    TORNADO_MISSILE = 5,
    TORNADO_SMALL_MISSILE = 6,
    PROWLER_MISSILE = 7,
    UPGRADE = 4,
    SHIELD = 8,
    INFERNO = 9
}
export declare enum MOB_DESPAWN_TYPES {
    EXPIRED = 0,
    PICKUP = 1
}
export declare enum PLAYER_LEVEL_UPDATE_TYPES {
    INFORM = 0,
    LEVELUP = 1
}
export declare enum SERVER_CUSTOM_TYPES {
    CTF = 2,
    BTR = 1
}
export declare enum PLAYER_POWERUP_TYPES {
    SHIELD = 1,
    INFERNO = 2
}
export declare enum CTF_TEAMS {
    BLUE = 1,
    RED = 2
}
export declare enum CTF_FLAG_STATE {
    STATIC = 1,
    DYNAMIC = 1
}
export declare enum CTF_CAPTURE_BOUNTY {
    BASE = 100,
    INCREMENT = 100,
    MAX = 1000
}
export declare enum CTF_WIN_BOUNTY {
    BASE = 100,
    INCREMENT = 100,
    MAX = 1000
}
export declare enum BTR_WIN_BOUNTY {
    BASE = 500,
    INCREMENT = 500,
    MAX = 5000
}
export declare enum GAME_TYPES {
    FFA = 1,
    CTF = 2,
    BTR = 3
}
export declare enum GAME_STATE_CODES {
    LOGIN = 1,
    CONNECTING = 2,
    PLAYING = 3
}
export declare const GAME_STATE_NAMES: any;
