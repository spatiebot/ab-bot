export enum DATA_TYPES {
  text = 1,
  textbig = 2,
  arraysmall = 4,
  array = 3,
  uint8 = 5,
  uint16 = 6,
  uint24 = 7,
  uint32 = 8,
  float32 = 9,
  float64 = 10,
  boolean = 11,
  speed = 12,
  accel = 13,
  coordx = 14,
  coordy = 15,
  coord24 = 16,
  rotation = 17,
  healthenergy = 18,
  regen = 19,
}

const MAX_UINT8 = (1 << 8) - 1;
const MAX_UINT16 = (1 << 16) - 1;
const CHAR_BITS = 8;

export const DATA_TYPE_SIZE_BITS = {
  [DATA_TYPES.text]: 8 + MAX_UINT8 * CHAR_BITS,
  [DATA_TYPES.textbig]: 16 + MAX_UINT16 * CHAR_BITS,
  [DATA_TYPES.arraysmall]: 8,
  [DATA_TYPES.array]: 16,
  [DATA_TYPES.uint8]: 8,
  [DATA_TYPES.uint16]: 16,
  [DATA_TYPES.uint24]: 24,
  [DATA_TYPES.uint32]: 32,
  [DATA_TYPES.float32]: 64,
  [DATA_TYPES.float64]: 64,
  [DATA_TYPES.boolean]: 8,
  [DATA_TYPES.speed]: 16,
  [DATA_TYPES.accel]: 16,
  [DATA_TYPES.coordx]: 16,
  [DATA_TYPES.coordy]: 16,
  [DATA_TYPES.coord24]: 24,
  [DATA_TYPES.rotation]: 16,
  [DATA_TYPES.healthenergy]: 8,
  [DATA_TYPES.regen]: 16,
};
