export class ProtocolError {
  public name: string;

  public message: string;

  constructor(message = '') {
    this.name = this.constructor.name;
    this.message = message;
  }
}

export class StringEncodeError extends ProtocolError {}
export class StringDecodeError extends ProtocolError {}
