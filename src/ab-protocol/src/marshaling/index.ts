import CLIENT_SCHEMAS from '../schemas/client';
import SERVER_SCHEMAS from '../schemas/server';
import { DATA_TYPES } from '../types/data';
import { encodeUTF8 } from '../support/utils';
import PREDEFINED_CLIENT_MARSHAL from './client';
import PREDEFINED_SERVER_MARSHAL from './server';
import { WSPacket, ProtocolPacket } from '../packets';

const SERVER_MESSAGE = 0;
const CLIENT_MESSAGE = 1;

const encodedStrings = new (class {
  public storage: Uint8Array[];

  constructor() {
    this.storage = [];
  }

  last(): Uint8Array | null {
    if (this.storage.length > 0) {
      return this.storage[this.storage.length - 1];
    }

    return null;
  }

  put(str: Uint8Array): void {
    this.storage.push(str);
  }

  shift(): Uint8Array {
    return this.storage.shift();
  }

  flush(): void {
    this.storage = [];
  }
})();

const flushVars = (): void => {
  encodedStrings.flush();
};

const calcBufferLength = (
  data: ProtocolPacket,
  dataSchema: [string, DATA_TYPES, [string, DATA_TYPES, []?][]?][]
): number => {
  let length = 0;

  for (let fieldIndex = 0; fieldIndex < dataSchema.length; fieldIndex += 1) {
    const [fieldName, fieldType, subSchema] = dataSchema[fieldIndex];
    const fieldData = data[fieldName];

    switch (fieldType) {
      case DATA_TYPES.text:
      case DATA_TYPES.textbig:
        encodedStrings.put(encodeUTF8(fieldData as string));

        if (fieldType === DATA_TYPES.textbig) {
          length += 2;
        } else {
          length += 1;
        }

        length += encodedStrings.last().length;
        break;

      case DATA_TYPES.array:
      case DATA_TYPES.arraysmall:
        if (fieldType === DATA_TYPES.array) {
          length += 2;
        } else {
          length += 1;
        }

        for (let index = 0; index < (fieldData as []).length; index += 1) {
          length += calcBufferLength(fieldData[index], subSchema);
        }

        break;

      case DATA_TYPES.uint8:
      case DATA_TYPES.boolean:
      case DATA_TYPES.healthenergy:
        length += 1;
        break;

      case DATA_TYPES.uint16:
      case DATA_TYPES.speed:
      case DATA_TYPES.accel:
      case DATA_TYPES.coordx:
      case DATA_TYPES.coordy:
      case DATA_TYPES.rotation:
      case DATA_TYPES.regen:
        length += 2;
        break;

      case DATA_TYPES.uint24:
      case DATA_TYPES.coord24:
        length += 3;
        break;

      case DATA_TYPES.uint32:
      case DATA_TYPES.float32:
        length += 4;
        break;

      case DATA_TYPES.float64:
        length += 8;
        break;

      default:
        break;
    }
  }

  return length;
};

const fillBufferWithData = (
  dataView: DataView,
  startOffset: number,
  data: WSPacket,
  dataSchema: [string, DATA_TYPES, [string, DATA_TYPES, []?][]?][]
): number => {
  let offset = startOffset;

  if (offset === 1) {
    dataView.setUint8(0, data.c);
  }

  for (let fieldIndex = 0; fieldIndex < dataSchema.length; fieldIndex += 1) {
    const [fieldName, fieldType, subSchema] = dataSchema[fieldIndex];
    const fieldData = data[fieldName];

    switch (fieldType) {
      case DATA_TYPES.text:
      case DATA_TYPES.textbig:
        {
          const encodedString = encodedStrings.shift();

          if (fieldType === DATA_TYPES.textbig) {
            dataView.setUint16(offset, encodedString.length, true);
            offset += 2;
          } else {
            dataView.setUint8(offset, encodedString.length);
            offset += 1;
          }

          for (let charOffset = 0; charOffset < encodedString.length; charOffset += 1) {
            dataView.setUint8(offset + charOffset, encodedString[charOffset]);
          }

          offset += encodedString.length;
        }

        break;

      case DATA_TYPES.array:
      case DATA_TYPES.arraysmall:
        if (fieldType === DATA_TYPES.array) {
          dataView.setUint16(offset, fieldData.length, true);
          offset += 2;
        } else {
          dataView.setUint8(offset, fieldData.length);
          offset += 1;
        }

        for (
          let arrayElementIndex = 0;
          arrayElementIndex < fieldData.length;
          arrayElementIndex += 1
        ) {
          offset = fillBufferWithData(dataView, offset, fieldData[arrayElementIndex], subSchema);
        }

        break;

      case DATA_TYPES.uint8:
        dataView.setUint8(offset, fieldData);
        offset += 1;
        break;

      case DATA_TYPES.healthenergy:
        dataView.setUint8(offset, fieldData * 255);
        offset += 1;
        break;

      case DATA_TYPES.uint16:
        dataView.setUint16(offset, fieldData, true);
        offset += 2;
        break;

      case DATA_TYPES.regen:
        dataView.setUint16(offset, fieldData * 1e6 + 32768, true);
        offset += 2;
        break;

      case DATA_TYPES.rotation:
        dataView.setUint16(offset, fieldData * 6553.6, true);
        offset += 2;
        break;

      case DATA_TYPES.coordy:
        dataView.setUint16(offset, fieldData * 4 + 32768, true);
        offset += 2;
        break;

      case DATA_TYPES.coordx:
        dataView.setUint16(offset, fieldData * 2 + 32768, true);
        offset += 2;
        break;

      case DATA_TYPES.accel:
        dataView.setUint16(offset, fieldData * 32768 + 32768, true);
        offset += 2;
        break;

      case DATA_TYPES.speed:
        dataView.setUint16(offset, fieldData * 1638.4 + 32768, true);
        offset += 2;
        break;

      case DATA_TYPES.uint24:
        {
          const u8 = fieldData % 256;
          const u16 = (fieldData - u8) / 256;

          dataView.setUint16(offset, u16, true);
          offset += 2;

          dataView.setUint8(offset, u8);
          offset += 1;
        }

        break;

      case DATA_TYPES.coord24:
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

      case DATA_TYPES.uint32:
        dataView.setUint32(offset, fieldData, true);
        offset += 4;
        break;

      case DATA_TYPES.float32:
        dataView.setFloat32(offset, fieldData, true);
        offset += 4;
        break;

      case DATA_TYPES.float64:
        dataView.setFloat64(offset, fieldData, true);
        offset += 8;
        break;

      case DATA_TYPES.boolean:
        dataView.setUint8(offset, fieldData === false ? 0 : 1);
        offset += 1;
        break;

      default:
        break;
    }
  }

  return offset;
};

const marshal = (
  message: ProtocolPacket,
  type: number,
  usePredefinedMarshal: boolean
): ArrayBuffer => {
  flushVars();

  const messageCode = message.c;

  let schema = null;
  let predefMarshal = null;

  switch (type) {
    case CLIENT_MESSAGE:
      predefMarshal = PREDEFINED_CLIENT_MARSHAL[messageCode];
      schema = CLIENT_SCHEMAS[messageCode];
      break;

    case SERVER_MESSAGE:
      predefMarshal = PREDEFINED_SERVER_MARSHAL[messageCode];
      schema = SERVER_SCHEMAS[messageCode];
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
  } else {
    let dataView = null;
    let bufferLength = 0;

    bufferLength = 1 + calcBufferLength(message, schema);
    buffer = new ArrayBuffer(bufferLength);
    dataView = new DataView(buffer);

    fillBufferWithData(dataView, 1, message, schema);
  }

  return buffer;
};

/**
 * Marshal client message object to binary packet.
 * Pre generated converters are a bit faster.
 *
 * @param message
 * @param usePredefinedMarshal use pre generated converters.
 */
const marshalClientMessage = (
  message: ProtocolPacket,
  usePredefinedMarshal = true
): ArrayBuffer => {
  return marshal(message, CLIENT_MESSAGE, usePredefinedMarshal);
};

/**
 * Marshal server message object to binary packet.
 * Pre generated converters are a bit faster.
 *
 * @param message
 * @param usePredefinedMarshal use pre generated converters.
 */
const marshalServerMessage = (
  message: ProtocolPacket,
  usePredefinedMarshal = true
): ArrayBuffer => {
  return marshal(message, SERVER_MESSAGE, usePredefinedMarshal);
};

export { marshalClientMessage, marshalServerMessage };
