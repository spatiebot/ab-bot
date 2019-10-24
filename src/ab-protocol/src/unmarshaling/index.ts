import { ProtocolPacket } from '../packets';
import CLIENT_SCHEMAS from '../schemas/client';
import SERVER_SCHEMAS from '../schemas/server';
import { decodeUTF8 } from '../support/utils';
import { DATA_TYPES } from '../types/data';
import PREDEFINED_CLIENT_MARSHAL from './client';
import PREDEFINED_SERVER_MARSHAL from './server';

const SERVER_BUFFER = 0;
const CLIENT_BUFFER = 1;

const flushVars = (): void => {};

const readBufferData = (
  dataView: DataView,
  startReadIndex = 0,
  schema: [string, DATA_TYPES, [string, DATA_TYPES, []?][]?][]
): ProtocolPacket => {
  const message: ProtocolPacket = {};
  let readIndex = startReadIndex;

  if (readIndex === 0) {
    message.c = dataView.getUint8(0);
    readIndex += 1;
  }

  for (let fieldIndex = 0; fieldIndex < schema.length; fieldIndex += 1) {
    const [fieldName, fieldType, subSchema] = schema[fieldIndex];

    switch (fieldType) {
      case DATA_TYPES.text:
      case DATA_TYPES.textbig:
        {
          let stringLength = 0;

          if (fieldType === DATA_TYPES.text) {
            stringLength = dataView.getUint8(readIndex);
            readIndex += 1;
          } else {
            stringLength = dataView.getUint16(readIndex, true);
            readIndex += 2;
          }

          const encodedString = new Uint8Array(stringLength);

          for (let charIndex = 0; charIndex < stringLength; charIndex += 1) {
            encodedString[charIndex] = dataView.getUint8(readIndex + charIndex);
          }

          message[fieldName] = decodeUTF8(encodedString);
          readIndex += stringLength;
        }

        break;

      case DATA_TYPES.array:
      case DATA_TYPES.arraysmall:
        {
          let arrayLength = 0;

          if (fieldType === DATA_TYPES.arraysmall) {
            arrayLength = dataView.getUint8(readIndex);
            readIndex += 1;
          } else {
            arrayLength = dataView.getUint16(readIndex, true);
            readIndex += 2;
          }

          message[fieldName] = [];

          for (let arrayElementIndex = 0; arrayElementIndex < arrayLength; arrayElementIndex += 1) {
            const arrayElement = {};

            for (
              let subSchemaFieldIndex = 0;
              subSchemaFieldIndex < subSchema.length;
              subSchemaFieldIndex += 1
            ) {
              const [subFieldName, subFieldType] = subSchema[subSchemaFieldIndex];

              switch (subFieldType) {
                case DATA_TYPES.text:
                case DATA_TYPES.textbig:
                  {
                    let stringLength = 0;

                    if (subFieldType === DATA_TYPES.text) {
                      stringLength = dataView.getUint8(readIndex);
                      readIndex += 1;
                    } else {
                      stringLength = dataView.getUint16(readIndex, true);
                      readIndex += 2;
                    }

                    const encodedString = new Uint8Array(stringLength);

                    for (let charIndex = 0; charIndex < stringLength; charIndex += 1) {
                      encodedString[charIndex] = dataView.getUint8(readIndex + charIndex);
                    }

                    arrayElement[subFieldName] = decodeUTF8(encodedString);
                    readIndex += stringLength;
                  }

                  break;

                case DATA_TYPES.uint8:
                  arrayElement[subFieldName] = dataView.getUint8(readIndex);
                  readIndex += 1;
                  break;

                case DATA_TYPES.uint16:
                  arrayElement[subFieldName] = dataView.getUint16(readIndex, true);
                  readIndex += 2;
                  break;

                case DATA_TYPES.uint24:
                  {
                    const u16 = 256 * dataView.getUint16(readIndex, true);

                    readIndex += 2;
                    arrayElement[subFieldName] = u16 + dataView.getUint8(readIndex);
                    readIndex += 1;
                  }

                  break;

                case DATA_TYPES.uint32:
                  arrayElement[subFieldName] = dataView.getUint32(readIndex, true);
                  readIndex += 4;
                  break;

                case DATA_TYPES.float32:
                  arrayElement[subFieldName] = dataView.getFloat32(readIndex, true);
                  readIndex += 4;
                  break;

                case DATA_TYPES.float64:
                  arrayElement[subFieldName] = dataView.getFloat64(readIndex, true);
                  readIndex += 8;
                  break;

                case DATA_TYPES.boolean:
                  arrayElement[subFieldName] = dataView.getUint8(readIndex) !== 0;
                  readIndex += 1;
                  break;

                case DATA_TYPES.speed:
                  arrayElement[subFieldName] =
                    (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
                  readIndex += 2;
                  break;

                case DATA_TYPES.accel:
                  arrayElement[subFieldName] =
                    (dataView.getUint16(readIndex, true) - 32768) / 32768;
                  readIndex += 2;
                  break;

                case DATA_TYPES.coordx:
                  arrayElement[subFieldName] = (dataView.getUint16(readIndex, true) - 32768) / 2;
                  readIndex += 2;
                  break;

                case DATA_TYPES.coordy:
                  arrayElement[subFieldName] = (dataView.getUint16(readIndex, true) - 32768) / 4;
                  readIndex += 2;
                  break;

                case DATA_TYPES.coord24:
                  {
                    const u16 = 256 * dataView.getUint16(readIndex, true);

                    readIndex += 2;
                    arrayElement[subFieldName] =
                      (u16 + dataView.getUint8(readIndex) - 8388608) / 512;
                    readIndex += 1;
                  }

                  break;

                case DATA_TYPES.rotation:
                  arrayElement[subFieldName] = dataView.getUint16(readIndex, true) / 6553.6;
                  readIndex += 2;
                  break;

                case DATA_TYPES.regen:
                  arrayElement[subFieldName] = (dataView.getUint16(readIndex, true) - 32768) / 1e6;
                  readIndex += 2;
                  break;

                case DATA_TYPES.healthenergy:
                  arrayElement[subFieldName] = dataView.getUint8(readIndex) / 255;
                  readIndex += 1;
                  break;

                default:
                  throw Error();
              }
            }

            (message[fieldName] as {}[]).push(arrayElement);
          }
        }

        break;

      case DATA_TYPES.uint8:
        message[fieldName] = dataView.getUint8(readIndex);
        readIndex += 1;
        break;

      case DATA_TYPES.uint16:
        message[fieldName] = dataView.getUint16(readIndex, true);
        readIndex += 2;
        break;

      case DATA_TYPES.uint24:
        {
          const u16 = 256 * dataView.getUint16(readIndex, true);

          readIndex += 2;
          message[fieldName] = u16 + dataView.getUint8(readIndex);
          readIndex += 1;
        }

        break;

      case DATA_TYPES.uint32:
        message[fieldName] = dataView.getUint32(readIndex, true);
        readIndex += 4;
        break;

      case DATA_TYPES.float32:
        message[fieldName] = dataView.getFloat32(readIndex, true);
        readIndex += 4;
        break;

      case DATA_TYPES.float64:
        message[fieldName] = dataView.getFloat64(readIndex, true);
        readIndex += 8;
        break;

      case DATA_TYPES.boolean:
        message[fieldName] = dataView.getUint8(readIndex) !== 0;
        readIndex += 1;
        break;

      case DATA_TYPES.speed:
        message[fieldName] = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;
        readIndex += 2;
        break;

      case DATA_TYPES.accel:
        message[fieldName] = (dataView.getUint16(readIndex, true) - 32768) / 32768;
        readIndex += 2;
        break;

      case DATA_TYPES.coordx:
        message[fieldName] = (dataView.getUint16(readIndex, true) - 32768) / 2;
        readIndex += 2;
        break;

      case DATA_TYPES.coordy:
        message[fieldName] = (dataView.getUint16(readIndex, true) - 32768) / 4;
        readIndex += 2;
        break;

      case DATA_TYPES.coord24:
        {
          const u16 = 256 * dataView.getUint16(readIndex, true);

          readIndex += 2;
          message[fieldName] = (u16 + dataView.getUint8(readIndex) - 8388608) / 512;
          readIndex += 1;
        }

        break;

      case DATA_TYPES.rotation:
        message[fieldName] = dataView.getUint16(readIndex, true) / 6553.6;
        readIndex += 2;
        break;

      case DATA_TYPES.regen:
        message[fieldName] = (dataView.getUint16(readIndex, true) - 32768) / 1e6;
        readIndex += 2;
        break;

      case DATA_TYPES.healthenergy:
        message[fieldName] = dataView.getUint8(readIndex) / 255;
        readIndex += 1;
        break;

      default:
        return null;
    }
  }

  return message;
};

const unmarshal = (
  buffer: ArrayBuffer,
  type: number,
  usePredefinedMarshal: boolean
): ProtocolPacket => {
  flushVars();

  const dataView = new DataView(buffer);
  const messageCode = dataView.getUint8(0);

  let predefMarshal = null;
  let message = null;
  let schema = null;

  switch (type) {
    case CLIENT_BUFFER:
      predefMarshal = PREDEFINED_CLIENT_MARSHAL[messageCode];
      schema = CLIENT_SCHEMAS[messageCode];
      break;

    case SERVER_BUFFER:
      predefMarshal = PREDEFINED_SERVER_MARSHAL[messageCode];
      schema = SERVER_SCHEMAS[messageCode];
      break;

    default:
      return null;
  }

  if (usePredefinedMarshal && predefMarshal) {
    message = predefMarshal(buffer);
  } else {
    if (schema === null) {
      return null;
    }

    message = readBufferData(dataView, 0, schema);
  }

  return message;
};

/**
 * Unmarshal client binary packet to protocol message.
 * Pre generated converters are a bit faster.
 *
 * @param message
 * @param usePredefinedMarshal use pre generated converters.
 */
const unmarshalClientMessage = (
  message: ArrayBuffer,
  usePredefinedMarshal = true
): ProtocolPacket => {
  return unmarshal(message, CLIENT_BUFFER, usePredefinedMarshal);
};

/**
 * Unmarshal server binary packet to protocol message.
 * Pre generated converters are a bit faster.
 *
 * @param message
 * @param usePredefinedMarshal use pre generated converters.
 */
const unmarshalServerMessage = (
  message: ArrayBuffer,
  usePredefinedMarshal = true
): ProtocolPacket => {
  return unmarshal(message, SERVER_BUFFER, usePredefinedMarshal);
};

export { unmarshalClientMessage, unmarshalServerMessage };
