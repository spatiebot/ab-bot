import { Keystate } from '../types/client';

export const encodeUpgrades = (speed: number, shield: number, inferno: number): number => {
  return (speed & 7) | (shield << 3) | (inferno << 4);
};

export const encodeKeystate = (
  keystate: Keystate,
  boost: boolean,
  strafe: boolean,
  stealthed: boolean,
  flagspeed: boolean
): number => {
  const down = keystate.DOWN === true ? 1 : 0;

  return (
    0 |
    ((keystate.UP === true ? 1 : 0) << 0) |
    ((keystate.UP === true ? 0 : down) << 1) |
    ((keystate.LEFT === true ? 1 : 0) << 2) |
    ((keystate.RIGHT === true ? 1 : 0) << 3) |
    ((boost === true ? 1 : 0) << 4) |
    ((strafe === true ? 1 : 0) << 5) |
    ((stealthed === true ? 1 : 0) << 6) |
    ((flagspeed === true ? 1 : 0) << 7)
  );
};
