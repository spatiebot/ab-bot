"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProtocolError {
    constructor(message = '') {
        this.name = this.constructor.name;
        this.message = message;
    }
}
exports.ProtocolError = ProtocolError;
class StringEncodeError extends ProtocolError {
}
exports.StringEncodeError = StringEncodeError;
class StringDecodeError extends ProtocolError {
}
exports.StringDecodeError = StringDecodeError;
//# sourceMappingURL=errors.js.map