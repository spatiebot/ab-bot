export declare enum DATA_TYPES {
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
    regen = 19
}
export declare const DATA_TYPE_SIZE_BITS: {
    [DATA_TYPES.text]: number;
    [DATA_TYPES.textbig]: number;
    [DATA_TYPES.arraysmall]: number;
    [DATA_TYPES.array]: number;
    [DATA_TYPES.uint8]: number;
    [DATA_TYPES.uint16]: number;
    [DATA_TYPES.uint24]: number;
    [DATA_TYPES.uint32]: number;
    [DATA_TYPES.float32]: number;
    [DATA_TYPES.float64]: number;
    [DATA_TYPES.boolean]: number;
    [DATA_TYPES.speed]: number;
    [DATA_TYPES.accel]: number;
    [DATA_TYPES.coordx]: number;
    [DATA_TYPES.coordy]: number;
    [DATA_TYPES.coord24]: number;
    [DATA_TYPES.rotation]: number;
    [DATA_TYPES.healthenergy]: number;
    [DATA_TYPES.regen]: number;
};
