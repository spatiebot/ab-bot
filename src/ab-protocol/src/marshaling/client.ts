/*
 *
 * This file was created automatically with generator
 * Please don't change it manually.
 *
 */

import packet from '../packets/client';
import { encodeUTF8 } from '../support/utils';
import {
  Login,
  Backup,
  Horizon,
  Ack,
  Pong,
  Key,
  Command,
  Scoredetailed,
  Chat,
  Whisper,
  Say,
  Teamchat,
  Votemute,
  Localping,
} from '../types/packets-client';

export default {
  [packet.LOGIN]: (msg: Login): ArrayBuffer => {
    // Root strings size calculation
    const name = encodeUTF8(msg.name);
    const session = encodeUTF8(msg.session);
    const flag = encodeUTF8(msg.flag);

    const buffer = new ArrayBuffer(9 + name.length + session.length + flag.length);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // protocol, uint8
    dataView.setUint8(offset, msg.protocol);
    offset += 1;

    // name, text
    dataView.setUint8(offset, name.length);
    offset += 1;

    for (let charOffset = 0; charOffset < name.length; charOffset += 1) {
      dataView.setUint8(offset + charOffset, name[charOffset]);
    }

    offset += name.length;

    // session, text
    dataView.setUint8(offset, session.length);
    offset += 1;

    for (let charOffset = 0; charOffset < session.length; charOffset += 1) {
      dataView.setUint8(offset + charOffset, session[charOffset]);
    }

    offset += session.length;

    // horizonX, uint16
    dataView.setUint16(offset, msg.horizonX, true);
    offset += 2;

    // horizonY, uint16
    dataView.setUint16(offset, msg.horizonY, true);
    offset += 2;

    // flag, text
    dataView.setUint8(offset, flag.length);
    offset += 1;

    for (let charOffset = 0; charOffset < flag.length; charOffset += 1) {
      dataView.setUint8(offset + charOffset, flag[charOffset]);
    }


    return buffer;
  },

  [packet.BACKUP]: (msg: Backup): ArrayBuffer => {
    // Root strings size calculation
    const token = encodeUTF8(msg.token);

    const buffer = new ArrayBuffer(2 + token.length);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // token, text
    dataView.setUint8(offset, token.length);
    offset += 1;

    for (let charOffset = 0; charOffset < token.length; charOffset += 1) {
      dataView.setUint8(offset + charOffset, token[charOffset]);
    }


    return buffer;
  },

  [packet.HORIZON]: (msg: Horizon): ArrayBuffer => {
    const buffer = new ArrayBuffer(5);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // horizonX, uint16
    dataView.setUint16(offset, msg.horizonX, true);
    offset += 2;

    // horizonY, uint16
    dataView.setUint16(offset, msg.horizonY, true);
    offset += 2;

    return buffer;
  },

  [packet.ACK]: (msg: Ack): ArrayBuffer => {
    const buffer = new ArrayBuffer(1);
    const dataView = new DataView(buffer);

    dataView.setUint8(0, msg.c);

    return buffer;
  },

  [packet.PONG]: (msg: Pong): ArrayBuffer => {
    const buffer = new ArrayBuffer(5);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // num, uint32
    dataView.setUint32(offset, msg.num, true);
    offset += 4;

    return buffer;
  },

  [packet.KEY]: (msg: Key): ArrayBuffer => {
    const buffer = new ArrayBuffer(7);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // seq, uint32
    dataView.setUint32(offset, msg.seq, true);
    offset += 4;

    // key, uint8
    dataView.setUint8(offset, msg.key);
    offset += 1;

    // state, boolean
    dataView.setUint8(offset, msg.state === false ? 0 : 1);
    offset += 1;

    return buffer;
  },

  [packet.COMMAND]: (msg: Command): ArrayBuffer => {
    // Root strings size calculation
    const com = encodeUTF8(msg.com);
    const data = encodeUTF8(msg.data);

    const buffer = new ArrayBuffer(3 + com.length + data.length);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // com, text
    dataView.setUint8(offset, com.length);
    offset += 1;

    for (let charOffset = 0; charOffset < com.length; charOffset += 1) {
      dataView.setUint8(offset + charOffset, com[charOffset]);
    }

    offset += com.length;

    // data, text
    dataView.setUint8(offset, data.length);
    offset += 1;

    for (let charOffset = 0; charOffset < data.length; charOffset += 1) {
      dataView.setUint8(offset + charOffset, data[charOffset]);
    }


    return buffer;
  },

  [packet.SCOREDETAILED]: (msg: Scoredetailed): ArrayBuffer => {
    const buffer = new ArrayBuffer(1);
    const dataView = new DataView(buffer);

    dataView.setUint8(0, msg.c);

    return buffer;
  },

  [packet.CHAT]: (msg: Chat): ArrayBuffer => {
    // Root strings size calculation
    const text = encodeUTF8(msg.text);

    const buffer = new ArrayBuffer(2 + text.length);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // text, text
    dataView.setUint8(offset, text.length);
    offset += 1;

    for (let charOffset = 0; charOffset < text.length; charOffset += 1) {
      dataView.setUint8(offset + charOffset, text[charOffset]);
    }


    return buffer;
  },

  [packet.WHISPER]: (msg: Whisper): ArrayBuffer => {
    // Root strings size calculation
    const text = encodeUTF8(msg.text);

    const buffer = new ArrayBuffer(4 + text.length);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // id, uint16
    dataView.setUint16(offset, msg.id, true);
    offset += 2;

    // text, text
    dataView.setUint8(offset, text.length);
    offset += 1;

    for (let charOffset = 0; charOffset < text.length; charOffset += 1) {
      dataView.setUint8(offset + charOffset, text[charOffset]);
    }


    return buffer;
  },

  [packet.SAY]: (msg: Say): ArrayBuffer => {
    // Root strings size calculation
    const text = encodeUTF8(msg.text);

    const buffer = new ArrayBuffer(2 + text.length);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // text, text
    dataView.setUint8(offset, text.length);
    offset += 1;

    for (let charOffset = 0; charOffset < text.length; charOffset += 1) {
      dataView.setUint8(offset + charOffset, text[charOffset]);
    }


    return buffer;
  },

  [packet.TEAMCHAT]: (msg: Teamchat): ArrayBuffer => {
    // Root strings size calculation
    const text = encodeUTF8(msg.text);

    const buffer = new ArrayBuffer(2 + text.length);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // text, text
    dataView.setUint8(offset, text.length);
    offset += 1;

    for (let charOffset = 0; charOffset < text.length; charOffset += 1) {
      dataView.setUint8(offset + charOffset, text[charOffset]);
    }


    return buffer;
  },

  [packet.VOTEMUTE]: (msg: Votemute): ArrayBuffer => {
    const buffer = new ArrayBuffer(3);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // id, uint16
    dataView.setUint16(offset, msg.id, true);
    offset += 2;

    return buffer;
  },

  [packet.LOCALPING]: (msg: Localping): ArrayBuffer => {
    const buffer = new ArrayBuffer(5);
    const dataView = new DataView(buffer);

    let offset = 0;

    dataView.setUint8(offset, msg.c);
    offset += 1;

    // auth, uint32
    dataView.setUint32(offset, msg.auth, true);
    offset += 4;

    return buffer;
  }
};
