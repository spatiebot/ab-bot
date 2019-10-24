import { MAP_SIZE } from '../types/server';
import { Keystate } from '../types/client';

const clamp = (value: number, lower: number, upper: number): number => {
  if (value <= lower) {
    return lower;
  }

  if (value >= upper) {
    return upper;
  }

  return value;
};

export const levelToBouty = (level: number): number => {
  return ((level - 1) / 0.0111) ** 2;
};

export const decodeMinimapCoords = (x: number, y: number): { x: number; y: number } => {
  return {
    x: 128 * x - MAP_SIZE.WIDTH / 2 + 64,
    y: clamp(128 * y - MAP_SIZE.HEIGHT, -MAP_SIZE.HEIGHT / 2, MAP_SIZE.HEIGHT / 2) + 64,
  };
};

export const decodeUpgrades = (upgrades: number): {speed: number, shield: number, inferno: number} => {
  const speed = upgrades & 7;
  const shield = (upgrades & 8) >> 3;
  const inferno = (upgrades & 16) >> 4;

  return {
    speed,
    shield,
    inferno
  };
};

export const decodeKeystate = (
  keystate: number
): {
  keystate: Keystate;
  boost: boolean;
  strafe: boolean;
  stealthed: boolean;
  flagspeed: boolean;
} => {
  return {
    keystate: {
      UP: (keystate & (1 << 0)) === 1 << 0,
      DOWN: (keystate & (1 << 1)) === 1 << 1,
      LEFT: (keystate & (1 << 2)) === 1 << 2,
      RIGHT: (keystate & (1 << 3)) === 1 << 3,
    },
    boost: (keystate & (1 << 4)) === 1 << 4,
    strafe: (keystate & (1 << 5)) === 1 << 5,
    stealthed: (keystate & (1 << 6)) === 1 << 6,
    flagspeed: (keystate & (1 << 7)) === 1 << 7,
  };
};

export default levelToBouty;
