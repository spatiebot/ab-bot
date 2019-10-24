/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const server = require('../dist/schemas/server').default;
const client = require('../dist/schemas/client').default;
const serverPackets = require('../dist/packets/server').default;
const clientPackets = require('../dist/packets/client').default;
const { DATA_TYPES } = require('../dist/types/data');

let source = '';

const comment = (text, indent = 0, breakLine = true) => {
  const indentString = ' '.repeat(indent);

  if (text === '/*') {
    source += `${indentString}/*`;
  } else if (text === '*/') {
    source += `${indentString} */`;
  } else if (text[0] === '*') {
    source += `${indentString}*`;

    if (text.substring(2) !== '') {
      source += ` ${text.substring(2)}`;
    }
  } else {
    source += `${indentString}// ${text}`;
  }

  if (breakLine) {
    source += '\n';
  }
};

const code = (text, indent = 0, breakLine = true) => {
  const indentString = ' '.repeat(indent);

  source += `${indentString}${text}`;

  if (breakLine) {
    source += '\n';
  }
};

const newline = () => {
  source += '\n';
};

const codeLn = (text, indent = 0) => {
  code(text, indent);
  newline();
};

const commentLn = (text, indent = 0) => {
  comment(text, indent);
  newline();
};

const toPascalCase = s => {
  return (
    s.charAt(0).toUpperCase() +
    s
      .slice(1)
      .toLowerCase()
      .replace(/([-_][a-z])/gi, $1 => {
        return $1
          .toUpperCase()
          .replace('-', '')
          .replace('_', '');
      })
  );
};

const typeNames = {};
const serverPacketNames = {};
const clientPacketNames = {};

Object.entries(serverPackets).forEach(([key, value]) => {
  serverPacketNames[value] = key;
});

Object.entries(clientPackets).forEach(([key, value]) => {
  clientPacketNames[value] = key;
});

Object.entries(DATA_TYPES).forEach(([key, value]) => {
  typeNames[value] = key;
});

[
  [Object.entries(client), clientPacketNames, 'client', '../src/unmarshaling/client.ts'],
  [Object.entries(server), serverPacketNames, 'server', '../src/unmarshaling/server.ts'],
].forEach(([schemaEntries, packetNames, importName, outputFile]) => {
  source = '';

  comment('/*');
  comment('*', 1);
  comment('* This file was created automatically with generator', 1);
  comment("* Please don't change it manually.", 1);
  comment('*', 1);
  commentLn('*/');
  code(`import packet from '../packets/${importName}';`);
  code("import { decodeUTF8 } from '../support/utils';");
  code('import {');

  Object.values(packetNames).forEach(packetName => {
    code(`${toPascalCase(packetName)},`, 2);
  });

  if (importName === 'client') {
    codeLn("} from '../types/packets-client';");
  } else {
    codeLn("} from '../types/packets-server';");
  }

  code('export default {');

  schemaEntries.forEach(([key, schema], schemaEntryIndex) => {
    if (!key || key === 'undefined') {
      return;
    }

    if (schema.length === 0) {
      // Empty message
      code(`[packet.${packetNames[key]}]: (): ${toPascalCase(packetNames[key])} => {`, 2);
      code(`return { c: ${key} };`, 4);
    } else {
      code(
        `[packet.${packetNames[key]}]: (buffer: ArrayBuffer): ${toPascalCase(
          packetNames[key]
        )} => {`,
        2
      );
      code(`const msg: ${toPascalCase(packetNames[key])} = { c: ${key} };`, 4);
      codeLn('const dataView = new DataView(buffer);', 4);
      codeLn('let readIndex = 1;', 4);

      schema.forEach(([fieldName, fieldType, subSchema]) => {
        comment(`${fieldName}, ${typeNames[fieldType]}`, 4);

        switch (fieldType) {
          case DATA_TYPES.text:
          case DATA_TYPES.textbig:
            code('{', 4);

            if (fieldType === DATA_TYPES.text) {
              code('const stringLength = dataView.getUint8(readIndex);', 6);
            } else {
              code('const stringLength = dataView.getUint16(readIndex, true);', 6);
            }

            codeLn('const encodedString = new Uint8Array(stringLength);', 6);
            codeLn(`readIndex += ${fieldType === DATA_TYPES.text ? 1 : 2};`, 6);

            code('for (let charIndex = 0; charIndex < stringLength; charIndex += 1) {', 6);
            code('encodedString[charIndex] = dataView.getUint8(readIndex + charIndex);', 8);
            codeLn('}', 6);

            code(`msg.${fieldName} = decodeUTF8(encodedString);`, 6);
            code('readIndex += stringLength;', 6);
            codeLn('}', 4);
            break;

          case DATA_TYPES.array:
          case DATA_TYPES.arraysmall:
            code('{', 4);

            if (fieldType === DATA_TYPES.arraysmall) {
              codeLn('const arrayLength = dataView.getUint8(readIndex);', 6);
            } else {
              codeLn('const arrayLength = dataView.getUint16(readIndex, true);', 6);
            }

            code(`readIndex += ${fieldType === DATA_TYPES.arraysmall ? 1 : 2};`, 6);
            codeLn(`msg.${fieldName} = [];`, 6);

            code('for (let i = 0; i < arrayLength; i += 1) {', 6);
            codeLn(`const arrayElement: ${toPascalCase(packetNames[key])}['${fieldName}'][0] = {};`, 8);

            for (let j = 0; j < subSchema.length; j += 1) {
              const [subFieldName, subFieldType] = subSchema[j];

              comment(`${subFieldName}, ${typeNames[subFieldType]}`, 8);

              switch (subFieldType) {
                case DATA_TYPES.text:
                case DATA_TYPES.textbig:
                  code('{', 8);

                  if (subFieldType === DATA_TYPES.text) {
                    code('const stringLength = dataView.getUint8(readIndex);', 10);
                  } else {
                    code('const stringLength = dataView.getUint16(readIndex, true);', 10);
                  }

                  codeLn('const encodedString = new Uint8Array(stringLength);', 10);
                  code(`readIndex += ${subFieldType === DATA_TYPES.text ? 1 : 2};`, 10);

                  code('for (let charIndex = 0; charIndex < stringLength; charIndex += 1) {', 10);
                  code('encodedString[charIndex] = dataView.getUint8(readIndex + charIndex);', 12);
                  codeLn('}', 10);

                  code(`arrayElement.${subFieldName} = decodeUTF8(encodedString);`, 10);
                  code('readIndex += stringLength;', 10);
                  codeLn('}', 8);
                  break;

                case DATA_TYPES.uint8:
                  code(`arrayElement.${subFieldName} = dataView.getUint8(readIndex);`, 8);
                  codeLn('readIndex += 1;', 8);
                  break;

                case DATA_TYPES.uint16:
                  code(`arrayElement.${subFieldName} = dataView.getUint16(readIndex, true);`, 8);
                  codeLn('readIndex += 2;', 8);
                  break;

                case DATA_TYPES.uint24:
                  code('{', 8);
                  codeLn('const u16 = 256 * dataView.getUint16(readIndex, true);', 10);

                  code('readIndex += 2;', 10);
                  code(`arrayElement.${subFieldName} = u16 + dataView.getUint8(readIndex)`, 10);
                  code('readIndex += 1;', 10);
                  codeLn('}', 8);
                  break;

                case DATA_TYPES.uint32:
                  code(`arrayElement.${subFieldName} = dataView.getUint32(readIndex, true);`, 8);
                  codeLn('readIndex += 4;', 8);
                  break;

                case DATA_TYPES.float32:
                  code(`arrayElement.${subFieldName} = dataView.getFloat32(readIndex, true);`, 8);
                  codeLn('readIndex += 4;', 8);
                  break;

                case DATA_TYPES.float64:
                  code(`arrayElement.${subFieldName} = dataView.getFloat64(readIndex, true);`, 8);
                  codeLn('readIndex += 8;', 8);
                  break;

                case DATA_TYPES.boolean:
                  code(`arrayElement.${subFieldName} = dataView.getUint8(readIndex) !== 0;`, 8);
                  codeLn('readIndex += 1;', 8);
                  break;

                case DATA_TYPES.speed:
                  code(
                    `arrayElement.${subFieldName} = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;`,
                    8
                  );
                  codeLn('readIndex += 2;', 8);
                  break;

                case DATA_TYPES.accel:
                  code(
                    `arrayElement.${subFieldName} = (dataView.getUint16(readIndex, true) - 32768) / 32768;`,
                    8
                  );
                  codeLn('readIndex += 2;', 8);
                  break;

                case DATA_TYPES.coordx:
                  code(
                    `arrayElement.${subFieldName} = (dataView.getUint16(readIndex, true) - 32768) / 2;`,
                    8
                  );
                  codeLn('readIndex += 2;', 8);
                  break;

                case DATA_TYPES.coordy:
                  code(
                    `arrayElement.${subFieldName} = (dataView.getUint16(readIndex, true) - 32768) / 4;`,
                    8
                  );
                  codeLn('readIndex += 2;', 8);
                  break;

                case DATA_TYPES.coord24:
                  code('{', 8);
                  codeLn('const u16 = 256 * dataView.getUint16(readIndex, true);', 10);

                  code('readIndex += 2;', 10);
                  code(
                    `arrayElement.${subFieldName} = (u16 + dataView.getUint8(readIndex) - 8388608) / 512;`,
                    10
                  );
                  code('readIndex += 1;', 10);
                  codeLn('}', 8);
                  break;

                case DATA_TYPES.rotation:
                  code(
                    `arrayElement.${subFieldName} = dataView.getUint16(readIndex, true) / 6553.6;`,
                    8
                  );
                  codeLn('readIndex += 2;', 8);
                  break;

                case DATA_TYPES.regen:
                  code(
                    `arrayElement.${subFieldName} = (dataView.getUint16(readIndex, true) - 32768) / 1e6;`,
                    8
                  );
                  codeLn('readIndex += 2;', 8);
                  break;

                case DATA_TYPES.healthenergy:
                  code(`arrayElement.${subFieldName} = dataView.getUint8(readIndex) / 255;`, 8);
                  codeLn('readIndex += 1;', 8);
                  break;

                default:
                  break;
              }
            }

            code(`msg.${fieldName}.push(arrayElement)`, 8);
            code('}', 6);
            codeLn('}', 4);
            break;

          case DATA_TYPES.uint8:
            code(`msg.${fieldName} = dataView.getUint8(readIndex);`, 4);
            codeLn('readIndex += 1;', 4);
            break;

          case DATA_TYPES.uint16:
            code(`msg.${fieldName} = dataView.getUint16(readIndex, true);`, 4);
            codeLn('readIndex += 2;', 4);
            break;

          case DATA_TYPES.uint24:
            code('{', 4);
            codeLn('const u16 = 256 * dataView.getUint16(readIndex, true);', 6);

            codeLn('readIndex += 2;', 6);
            code(`msg.${fieldName} = u16 + dataView.getUint8(readIndex);`, 6);
            code('readIndex += 1;', 6);
            codeLn('}', 4);
            break;

          case DATA_TYPES.uint32:
            code(`msg.${fieldName} = dataView.getUint32(readIndex, true);`, 4);
            codeLn('readIndex += 4;', 4);
            break;

          case DATA_TYPES.float32:
            code(`msg.${fieldName} = dataView.getFloat32(readIndex, true);`, 4);
            codeLn('readIndex += 4;', 4);
            break;

          case DATA_TYPES.float64:
            code(`msg.${fieldName} = dataView.getFloat64(readIndex, true);`, 4);
            codeLn('readIndex += 8;', 4);
            break;

          case DATA_TYPES.boolean:
            code(`msg.${fieldName} = dataView.getUint8(readIndex) !== 0;`, 4);
            codeLn('readIndex += 1;', 4);
            break;

          case DATA_TYPES.speed:
            code(`msg.${fieldName} = (dataView.getUint16(readIndex, true) - 32768) / 1638.4;`, 4);
            codeLn('readIndex += 2;', 4);
            break;

          case DATA_TYPES.accel:
            code(`msg.${fieldName} = (dataView.getUint16(readIndex, true) - 32768) / 32768;`, 4);
            codeLn('readIndex += 2;', 4);
            break;

          case DATA_TYPES.coordx:
            code(`msg.${fieldName} = (dataView.getUint16(readIndex, true) - 32768) / 2;`, 4);
            codeLn('readIndex += 2;', 4);
            break;

          case DATA_TYPES.coordy:
            code(`msg.${fieldName} = (dataView.getUint16(readIndex, true) - 32768) / 4;`, 4);
            codeLn('readIndex += 2;', 4);
            break;

          case DATA_TYPES.coord24:
            code('{', 4);
            codeLn('const u16 = 256 * dataView.getUint16(readIndex, true);', 6);

            code('readIndex += 2;', 6);
            code(`msg.${fieldName} = (u16 + dataView.getUint8(readIndex) - 8388608) / 512;`, 6);
            code('readIndex += 1;', 6);
            codeLn('}', 4);
            break;

          case DATA_TYPES.rotation:
            code(`msg.${fieldName} = dataView.getUint16(readIndex, true) / 6553.6;`, 4);
            codeLn('readIndex += 2;', 4);
            break;

          case DATA_TYPES.regen:
            code(`msg.${fieldName} = (dataView.getUint16(readIndex, true) - 32768) / 1e6;`, 4);
            codeLn('readIndex += 2;', 4);
            break;

          case DATA_TYPES.healthenergy:
            code(`msg.${fieldName} = dataView.getUint8(readIndex) / 255;`, 4);
            codeLn('readIndex += 1;', 4);
            break;

          default:
            return null;
        }
      });

      code('return msg;', 4);
    }

    if (schemaEntryIndex === schemaEntries.length - 1) {
      code('}', 2);
    } else {
      code('},', 2);
      newline();
    }
  });

  code('};');

  fs.writeFileSync(outputFile, source);
});
