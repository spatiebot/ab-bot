"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var KEY_CODES;
(function (KEY_CODES) {
    KEY_CODES[KEY_CODES["UP"] = 1] = "UP";
    KEY_CODES[KEY_CODES["DOWN"] = 2] = "DOWN";
    KEY_CODES[KEY_CODES["LEFT"] = 3] = "LEFT";
    KEY_CODES[KEY_CODES["RIGHT"] = 4] = "RIGHT";
    KEY_CODES[KEY_CODES["FIRE"] = 5] = "FIRE";
    KEY_CODES[KEY_CODES["SPECIAL"] = 6] = "SPECIAL";
})(KEY_CODES = exports.KEY_CODES || (exports.KEY_CODES = {}));
exports.KEY_NAMES = Object.assign({}, ...Object.entries(KEY_CODES).map(([name, code]) => ({ [code]: name })));
//# sourceMappingURL=client.js.map