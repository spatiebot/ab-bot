"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DATA_TYPES;
(function (DATA_TYPES) {
    DATA_TYPES[DATA_TYPES["text"] = 1] = "text";
    DATA_TYPES[DATA_TYPES["textbig"] = 2] = "textbig";
    DATA_TYPES[DATA_TYPES["arraysmall"] = 4] = "arraysmall";
    DATA_TYPES[DATA_TYPES["array"] = 3] = "array";
    DATA_TYPES[DATA_TYPES["uint8"] = 5] = "uint8";
    DATA_TYPES[DATA_TYPES["uint16"] = 6] = "uint16";
    DATA_TYPES[DATA_TYPES["uint24"] = 7] = "uint24";
    DATA_TYPES[DATA_TYPES["uint32"] = 8] = "uint32";
    DATA_TYPES[DATA_TYPES["float32"] = 9] = "float32";
    DATA_TYPES[DATA_TYPES["float64"] = 10] = "float64";
    DATA_TYPES[DATA_TYPES["boolean"] = 11] = "boolean";
    DATA_TYPES[DATA_TYPES["speed"] = 12] = "speed";
    DATA_TYPES[DATA_TYPES["accel"] = 13] = "accel";
    DATA_TYPES[DATA_TYPES["coordx"] = 14] = "coordx";
    DATA_TYPES[DATA_TYPES["coordy"] = 15] = "coordy";
    DATA_TYPES[DATA_TYPES["coord24"] = 16] = "coord24";
    DATA_TYPES[DATA_TYPES["rotation"] = 17] = "rotation";
    DATA_TYPES[DATA_TYPES["healthenergy"] = 18] = "healthenergy";
    DATA_TYPES[DATA_TYPES["regen"] = 19] = "regen";
})(DATA_TYPES = exports.DATA_TYPES || (exports.DATA_TYPES = {}));
const MAX_UINT8 = (1 << 8) - 1;
const MAX_UINT16 = (1 << 16) - 1;
const CHAR_BITS = 8;
exports.DATA_TYPE_SIZE_BITS = {
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
//# sourceMappingURL=data.js.map