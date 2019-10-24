/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const server = require('../dist/schemas/server').default;
const client = require('../dist/schemas/client').default;
const serverPackets = require('../dist/packets/server').default;
const clientPackets = require('../dist/packets/client').default;
const { DATA_TYPES } = require('../dist/types/data');

let source = '';
let rootStrings = [];
let arrays = [];
let arrayStrings = {};

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
const typeLengths = {
  [DATA_TYPES.text]: 1,
  [DATA_TYPES.textbig]: 2,
  [DATA_TYPES.array]: 1,
  [DATA_TYPES.arraysmall]: 2,
  [DATA_TYPES.uint8]: 1,
  [DATA_TYPES.uint16]: 2,
  [DATA_TYPES.uint24]: 3,
  [DATA_TYPES.uint32]: 4,
  [DATA_TYPES.float32]: 4,
  [DATA_TYPES.float64]: 8,
  [DATA_TYPES.boolean]: 1,
  [DATA_TYPES.speed]: 2,
  [DATA_TYPES.accel]: 2,
  [DATA_TYPES.coordx]: 2,
  [DATA_TYPES.coordy]: 2,
  [DATA_TYPES.coord24]: 3,
  [DATA_TYPES.rotation]: 2,
  [DATA_TYPES.healthenergy]: 1,
  [DATA_TYPES.regen]: 2,
};
const typeDataSets = {
  [DATA_TYPES.text]: false,
  [DATA_TYPES.textbig]: false,
  [DATA_TYPES.array]: false,
  [DATA_TYPES.arraysmall]: false,
  [DATA_TYPES.uint8]: 'setUint8(offset, %val%)',
  [DATA_TYPES.uint16]: 'setUint16(offset, %val%, true)',
  [DATA_TYPES.uint24]: false,
  [DATA_TYPES.uint32]: 'setUint32(offset, %val%, true)',
  [DATA_TYPES.float32]: 'setFloat32(offset, %val%, true)',
  [DATA_TYPES.float64]: 'setFloat64(offset, %val%, true)',
  [DATA_TYPES.boolean]: 'setUint8(offset, %val% === false ? 0 : 1)',
  [DATA_TYPES.speed]: 'setUint16(offset, %val% * 1638.4 + 32768, true)',
  [DATA_TYPES.accel]: 'setUint16(offset, %val% * 32768 + 32768, true)',
  [DATA_TYPES.coordx]: 'setUint16(offset, %val% * 2 + 32768, true)',
  [DATA_TYPES.coordy]: 'setUint16(offset, %val% * 4 + 32768, true)',
  [DATA_TYPES.coord24]: false,
  [DATA_TYPES.rotation]: 'setUint16(offset, %val% * 6553.6, true)',
  [DATA_TYPES.healthenergy]: 'setUint8(offset, %val% * 255)',
  [DATA_TYPES.regen]: 'setUint16(offset, %val% * 1e6 + 32768, true)',
};

Object.entries(serverPackets).forEach(([key, value]) => {
  serverPacketNames[value] = key;
});

Object.entries(clientPackets).forEach(([key, value]) => {
  clientPacketNames[value] = key;
});

Object.entries(DATA_TYPES).forEach(([key, value]) => {
  typeNames[value] = key;
});

const calcBufferLength = (dataSchema, array = '') => {
  let length = 0;

  for (let fieldIndex = 0; fieldIndex < dataSchema.length; fieldIndex += 1) {
    const [fieldName, fieldType, subSchema] = dataSchema[fieldIndex];

    switch (fieldType) {
      case DATA_TYPES.text:
      case DATA_TYPES.textbig:
        if (array !== '') {
          arrayStrings[`${array}.${fieldName}`] = {
            array,
            name: fieldName,
            length: fieldType === DATA_TYPES.textbig ? 2 : 1,
          };
        } else {
          rootStrings.push({
            name: fieldName,
            length: fieldType === DATA_TYPES.textbig ? 2 : 1,
          });
        }

        if (fieldType === DATA_TYPES.textbig) {
          length += 2;
        } else {
          length += 1;
        }

        break;

      case DATA_TYPES.array:
      case DATA_TYPES.arraysmall:
        arrays.push({
          name: fieldName,
          length: fieldType === DATA_TYPES.array ? 2 : 1,
          staticLength: calcBufferLength(subSchema, fieldName),
          strings: subSchema.filter(
            field => field[1] === DATA_TYPES.text || field[0] === DATA_TYPES.textbig
          ),
        });

        if (fieldType === DATA_TYPES.array) {
          length += 2;
        } else {
          length += 1;
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

[
  [Object.entries(client), clientPacketNames, 'client', '../src/marshaling/client.ts'],
  [Object.entries(server), serverPacketNames, 'server', '../src/marshaling/server.ts'],
].forEach(([schemaEntries, packetNames, importName, outputFile]) => {
  source = '';

  comment('/*');
  comment('*', 1);
  comment('* This file was created automatically with generator', 1);
  comment("* Please don't change it manually.", 1);
  comment('*', 1);
  commentLn('*/');
  code(`import packet from '../packets/${importName}';`);
  code("import { encodeUTF8 } from '../support/utils';");
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
    rootStrings = [];
    arrays = [];
    arrayStrings = {};

    if (!key || key === 'undefined') {
      return;
    }

    code(
      `[packet.${packetNames[key]}]: (msg: ${toPascalCase(packetNames[key])}): ArrayBuffer => {`,
      2
    );

    if (schema.length === 0) {
      // Empty message
      code('const buffer = new ArrayBuffer(1);', 4);
      codeLn('const dataView = new DataView(buffer);', 4);
      codeLn('dataView.setUint8(0, msg.c);', 4);
      code('return buffer;', 4);
    } else {
      const len = calcBufferLength(schema) + 1;
      const hasArraysStrings = arrays.some(element => element.strings.length > 0);

      if (arrays.length > 0) {
        comment('Arrays size calculation', 4);

        if (hasArraysStrings) {
          code(`const arrStrings = [];`, 4);
          code(`let arrStringsOffset = 0;`, 4);
        }

        codeLn(`let arraysSize = 0;`, 4);
      }

      arrays.forEach(({ name, staticLength, strings }) => {
        comment(`Array "${name}" size calculation`, 4);
        code(`for (let i = 0; i < msg.${name}.length; i += 1) {`, 4);
        code(`arraysSize += ${staticLength};`, 6);

        if (strings.length > 0) {
          newline();
        }

        strings.forEach(([stringField]) => {
          comment(`String "${stringField}" size calculation`, 6);
          code(`arrStrings[arrStringsOffset] = encodeUTF8(msg.${name}[i].${stringField});`, 6);
          code(`arraysSize += arrStrings[arrStringsOffset].length;`, 6);
          code(`arrStringsOffset += 1;`, 6);
        });

        codeLn('}', 4);
      });

      let stringsSize = '';

      if (rootStrings.length > 0) {
        comment('Root strings size calculation', 4);

        rootStrings.forEach(({ name }) => {
          stringsSize += ` + ${name}.length`;
          code(`const ${name} = encodeUTF8(msg.${name});`, 4);
        });
      }

      if (stringsSize !== '') {
        newline();
        code(`const buffer = new ArrayBuffer(${len}${stringsSize}`, 4, false);
      } else {
        code(`const buffer = new ArrayBuffer(${len}`, 4, false);
      }

      if (arrays.length > 0) {
        code(` + arraysSize);`, 0);
      } else {
        code(');');
      }

      codeLn('const dataView = new DataView(buffer);', 4);
      codeLn('let offset = 0;', 4);

      if (hasArraysStrings) {
        codeLn('arrStringsOffset = 0;', 4);
      }

      code('dataView.setUint8(offset, msg.c);', 4);
      codeLn('offset += 1;', 4);

      schema.forEach(([fieldName, fieldType, subSchema], fieldIndex) => {
        comment(`${fieldName}, ${typeNames[fieldType]}`, 4);

        if (typeDataSets[fieldType] === false) {
          if (fieldType === DATA_TYPES.text || fieldType === DATA_TYPES.textbig) {
            if (fieldType === DATA_TYPES.text) {
              code(`dataView.setUint8(offset, ${fieldName}.length);`, 4);
            } else {
              code(`dataView.setUint16(offset, ${fieldName}.length, true);`, 4);
            }

            codeLn(`offset += ${fieldType === DATA_TYPES.text ? 1 : 2};`, 4);

            code(
              `for (let charOffset = 0; charOffset < ${fieldName}.length; charOffset += 1) {`,
              4
            );
            code(`dataView.setUint8(offset + charOffset, ${fieldName}[charOffset]);`, 6);
            codeLn(`}`, 4);

            if (fieldIndex !== schema.length - 1) {
              code(`offset += ${fieldName}.length;`, 4);
            }
          } else if (fieldType === DATA_TYPES.array || fieldType === DATA_TYPES.arraysmall) {
            code('{', 4);
            codeLn(`const { ${fieldName} } = msg;`, 6);

            if (fieldType === DATA_TYPES.arraysmall) {
              code(`dataView.setUint8(offset, ${fieldName}.length);`, 6);
            } else {
              code(`dataView.setUint16(offset, ${fieldName}.length, true);`, 6);
            }

            codeLn(`offset += ${fieldType === DATA_TYPES.arraysmall ? 1 : 2};`, 6);

            code(`for (let i = 0; i < ${fieldName}.length; i += 1) {`, 6);

            subSchema.forEach(([arrFieldName, arrFieldType]) => {
              comment(`${fieldName}[${arrFieldName}], ${typeNames[arrFieldType]}`, 8);

              if (typeDataSets[arrFieldType] === false) {
                if (arrFieldType === DATA_TYPES.text || fieldType === DATA_TYPES.textbig) {
                  if (arrFieldType === DATA_TYPES.text) {
                    code(`dataView.setUint8(offset, arrStrings[arrStringsOffset].length);`, 8);
                  } else {
                    code(
                      `dataView.setUint16(offset, arrStrings[arrStringsOffset].length, true);`,
                      8
                    );
                  }

                  codeLn(`offset += ${arrFieldType === DATA_TYPES.text ? 1 : 2};`, 8);

                  code(
                    `for (let charOffset = 0; charOffset < arrStrings[arrStringsOffset].length; charOffset += 1) {`,
                    8
                  );
                  code(
                    `dataView.setUint8(offset + charOffset, arrStrings[arrStringsOffset][charOffset]);`,
                    10
                  );
                  code(`}`, 8);

                  code(`offset += arrStrings[arrStringsOffset].length;`, 8);
                  codeLn('arrStringsOffset += 1;', 8);
                } else if (arrFieldType === DATA_TYPES.uint24) {
                  code(`{`, 8);
                  code(`const u8 = ${fieldName}[i].${arrFieldName} % 256;`, 10);
                  codeLn(`const u16 = (${fieldName}[i].${arrFieldName} - u8) / 256;`, 10);
                  code(`dataView.setUint16(offset, u16, true);`, 10);
                  codeLn(`offset += 2;`, 10);
                  code(`dataView.setUint8(offset, u8)`, 10);
                  code(`offset += 1;`, 10);
                  code(`}`, 8);
                } else if (fieldType === DATA_TYPES.coord24) {
                  code(`{`, 8);
                  code(`const value = ${fieldName}[i].${arrFieldName} * 512 + 8388608;`, 10);
                  code(`const u8 = value % 256;`, 10);
                  codeLn(`const u16 = (value - u8) / 256;`, 10);
                  code(`dataView.setUint16(offset, u16, true);`, 10);
                  codeLn(`offset += 2;`, 10);
                  code(`dataView.setUint8(offset, u8)`, 10);
                  code(`offset += 1;`, 10);
                  code(`}`, 8);
                }
              } else {
                const dataSet = `${typeDataSets[arrFieldType]}`.replace(
                  '%val%',
                  `${fieldName}[i].${arrFieldName}`
                );

                code(`dataView.${dataSet};`, 8);
                codeLn(`offset += ${typeLengths[arrFieldType]};`, 8);
              }
            });

            code('}', 6); // array rows for loop
            code('}', 4); // array block
          } else if (fieldType === DATA_TYPES.uint24) {
            code(`{`, 4);
            code(`const u8 = msg.${fieldName} % 256;`, 6);
            codeLn(`const u16 = (msg.${fieldName} - u8) / 256;`, 6);
            code(`dataView.setUint16(offset, u16, true);`, 6);
            codeLn(`offset += 2;`, 6);
            code(`dataView.setUint8(offset, u8)`, 6);
            code('offset += 1;', 6);
            code(`}`, 4);
          } else if (fieldType === DATA_TYPES.coord24) {
            code(`{`, 4);
            code(`  const value = msg.${fieldName} * 512 + 8388608;`, 6);
            code(`  const u8 = value % 256;`, 6);
            codeLn(`  const u16 = (value - u8) / 256;`, 6);
            code(`  dataView.setUint16(offset, u16, true);`, 6);
            codeLn(`  offset += 2;`, 6);
            code(`  dataView.setUint8(offset, u8)`, 6);
            code(`offset += 1;`, 6);
            code(`}`, 4);
          }
        } else {
          const dataSet = `${typeDataSets[fieldType]}`.replace('%val%', `msg.${fieldName}`);

          code(`dataView.${dataSet};`, 4);
          code(`offset += ${typeLengths[fieldType]};`, 4);
        }

        if (fieldIndex !== schema.length - 1) {
          newline();
        }
      });

      newline();
      code('return buffer;', 4);
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
