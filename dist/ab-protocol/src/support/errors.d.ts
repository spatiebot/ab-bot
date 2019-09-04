export declare class ProtocolError {
    name: string;
    message: string;
    constructor(message?: string);
}
export declare class StringEncodeError extends ProtocolError {
}
export declare class StringDecodeError extends ProtocolError {
}
