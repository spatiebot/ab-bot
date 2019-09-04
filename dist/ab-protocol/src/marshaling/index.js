"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../schemas/client"));
const server_1 = __importDefault(require("../schemas/server"));
const data_1 = require("../types/data");
const utils_1 = require("../support/utils");
const client_2 = __importDefault(require("./client"));
const server_2 = __importDefault(require("./server"));
const SERVER_MESSAGE = 0;
const CLIENT_MESSAGE = 1;
const encodedStrings = new (class {
    constructor() {
        this.storage = [];
    }
    last() {
        if (this.storage.length > 0) {
            return this.storage[this.storage.length - 1];
        }
        return null;
    }
    put(str) {
        this.storage.push(str);
    }
    shift() {
        return this.storage.shift();
    }
    flush() {
        this.storage = [];
    }
})();
const flushVars = () => {
    encodedStrings.flush();
};
const calcBufferLength = (data, dataSchema) => {
    let length = 0;
    for (let fieldIndex = 0; fieldIndex < dataSchema.length; fieldIndex += 1) {
        const [fieldName, fieldType, subSchema] = dataSchema[fieldIndex];
        const fieldData = data[fieldName];
        switch (fieldType) {
            case data_1.DATA_TYPES.text:
            case data_1.DATA_TYPES.textbig:
                encodedStrings.put(utils_1.encodeUTF8(fieldData));
                if (fieldType === data_1.DATA_TYPES.textbig) {
                    length += 2;
                }
                else {
                    length += 1;
                }
                length += encodedStrings.last().length;
                break;
            case data_1.DATA_TYPES.array:
            case data_1.DATA_TYPES.arraysmall:
                if (fieldType === data_1.DATA_TYPES.array) {
                    length += 2;
                }
                else {
                    length += 1;
                }
                for (let index = 0; index < fieldData.length; index += 1) {
                    length += calcBufferLength(fieldData[index], subSchema);
                }
                break;
            case data_1.DATA_TYPES.uint8:
            case data_1.DATA_TYPES.boolean:
            case data_1.DATA_TYPES.healthenergy:
                length += 1;
                break;
            case data_1.DATA_TYPES.uint16:
            case data_1.DATA_TYPES.speed:
            case data_1.DATA_TYPES.accel:
            case data_1.DATA_TYPES.coordx:
            case data_1.DATA_TYPES.coordy:
            case data_1.DATA_TYPES.rotation:
            case data_1.DATA_TYPES.regen:
                length += 2;
                break;
            case data_1.DATA_TYPES.uint24:
            case data_1.DATA_TYPES.coord24:
                length += 3;
                break;
            case data_1.DATA_TYPES.uint32:
            case data_1.DATA_TYPES.float32:
                length += 4;
                break;
            case data_1.DATA_TYPES.float64:
                length += 8;
                break;
            default:
                break;
        }
    }
    return length;
};
const fillBufferWithData = (dataView, startOffset, data, dataSchema) => {
    let offset = startOffset;
    if (offset === 1) {
        dataView.setUint8(0, data.c);
    }
    for (let fieldIndex = 0; fieldIndex < dataSchema.length; fieldIndex += 1) {
        const [fieldName, fieldType, subSchema] = dataSchema[fieldIndex];
        const fieldData = data[fieldName];
        switch (fieldType) {
            case data_1.DATA_TYPES.text:
            case data_1.DATA_TYPES.textbig:
                {
                    const encodedString = encodedStrings.shift();
                    if (fieldType === data_1.DATA_TYPES.textbig) {
                        dataView.setUint16(offset, encodedString.length, true);
                        offset += 2;
                    }
                    else {
                        dataView.setUint8(offset, encodedString.length);
                        offset += 1;
                    }
                    for (let charOffset = 0; charOffset < encodedString.length; charOffset += 1) {
                        dataView.setUint8(offset + charOffset, encodedString[charOffset]);
                    }
                    offset += encodedString.length;
                }
                break;
            case data_1.DATA_TYPES.array:
            case data_1.DATA_TYPES.arraysmall:
                if (fieldType === data_1.DATA_TYPES.array) {
                    dataView.setUint16(offset, fieldData.length, true);
                    offset += 2;
                }
                else {
                    dataView.setUint8(offset, fieldData.length);
                    offset += 1;
                }
                for (let arrayElementIndex = 0; arrayElementIndex < fieldData.length; arrayElementIndex += 1) {
                    offset = fillBufferWithData(dataView, offset, fieldData[arrayElementIndex], subSchema);
                }
                break;
            case data_1.DATA_TYPES.uint8:
                dataView.setUint8(offset, fieldData);
                offset += 1;
                break;
            case data_1.DATA_TYPES.healthenergy:
                dataView.setUint8(offset, fieldData * 255);
                offset += 1;
                break;
            case data_1.DATA_TYPES.uint16:
                dataView.setUint16(offset, fieldData, true);
                offset += 2;
                break;
            case data_1.DATA_TYPES.regen:
                dataView.setUint16(offset, fieldData * 1e6 + 32768, true);
                offset += 2;
                break;
            case data_1.DATA_TYPES.rotation:
                dataView.setUint16(offset, fieldData * 6553.6, true);
                offset += 2;
                break;
            case data_1.DATA_TYPES.coordy:
                dataView.setUint16(offset, fieldData * 4 + 32768, true);
                offset += 2;
                break;
            case data_1.DATA_TYPES.coordx:
                dataView.setUint16(offset, fieldData * 2 + 32768, true);
                offset += 2;
                break;
            case data_1.DATA_TYPES.accel:
                dataView.setUint16(offset, fieldData * 32768 + 32768, true);
                offset += 2;
                break;
            case data_1.DATA_TYPES.speed:
                dataView.setUint16(offset, fieldData * 1638.4 + 32768, true);
                offset += 2;
                break;
            case data_1.DATA_TYPES.uint24:
                {
                    const u8 = fieldData % 256;
                    const u16 = (fieldData - u8) / 256;
                    dataView.setUint16(offset, u16, true);
                    offset += 2;
                    dataView.setUint8(offset, u8);
                    offset += 1;
                }
                break;
            case data_1.DATA_TYPES.coord24:
                {
                    const value = fieldData * 512 + 8388608;
                    const u8 = value % 256;
                    const u16 = (value - u8) / 256;
                    dataView.setUint16(offset, u16, true);
                    offset += 2;
                    dataView.setUint8(offset, u8);
                    offset += 1;
                }
                break;
            case data_1.DATA_TYPES.uint32:
                dataView.setUint32(offset, fieldData, true);
                offset += 4;
                break;
            case data_1.DATA_TYPES.float32:
                dataView.setFloat32(offset, fieldData, true);
                offset += 4;
                break;
            case data_1.DATA_TYPES.float64:
                dataView.setFloat64(offset, fieldData, true);
                offset += 8;
                break;
            case data_1.DATA_TYPES.boolean:
                dataView.setUint8(offset, fieldData === false ? 0 : 1);
                offset += 1;
                break;
            default:
                break;
        }
    }
    return offset;
};
const marshal = (message, type, usePredefinedMarshal) => {
    flushVars();
    const messageCode = message.c;
    let schema = null;
    let predefMarshal = null;
    switch (type) {
        case CLIENT_MESSAGE:
            predefMarshal = client_2.default[messageCode];
            schema = client_1.default[messageCode];
            break;
        case SERVER_MESSAGE:
            predefMarshal = server_2.default[messageCode];
            schema = server_1.default[messageCode];
            break;
        default:
            return null;
    }
    if (schema === null) {
        return null;
    }
    let buffer = null;
    if (usePredefinedMarshal && predefMarshal) {
        buffer = predefMarshal(message);
    }
    else {
        let dataView = null;
        let bufferLength = 0;
        bufferLength = 1 + calcBufferLength(message, schema);
        buffer = new ArrayBuffer(bufferLength);
        dataView = new DataView(buffer);
        fillBufferWithData(dataView, 1, message, schema);
    }
    return buffer;
};
const marshalClientMessage = (message, usePredefinedMarshal = true) => {
    return marshal(message, CLIENT_MESSAGE, usePredefinedMarshal);
};
exports.marshalClientMessage = marshalClientMessage;
const marshalServerMessage = (message, usePredefinedMarshal = true) => {
    return marshal(message, SERVER_MESSAGE, usePredefinedMarshal);
};
exports.marshalServerMessage = marshalServerMessage;
//# sourceMappingURL=index.js.map