/**
 * CLIENT_PACKETS.KEY types
 */
export enum KEY_CODES {
  UP = 1,
  DOWN = 2,
  LEFT = 3,
  RIGHT = 4,
  FIRE = 5,
  SPECIAL = 6,
}

export interface Keystate {
  UP: boolean;
  DOWN: boolean;
  LEFT: boolean;
  RIGHT: boolean;
}

export const KEY_NAMES = Object.assign(
  {},
  ...Object.entries(KEY_CODES).map(([name, code]) => ({ [code]: name }))
);
