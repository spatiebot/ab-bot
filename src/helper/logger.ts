import pino from 'pino';

export class Logger {
    private logger: pino.Logger;

    constructor(botIndex: number, botName: string, isDevelopment: boolean, level: string) {

        let config: any = {
            level,
            base: { bot: `${botIndex}(${botName})` }
        };

        if (isDevelopment) {
            config = {
                ...config,
                prettyPrint: {
                    colorize: true,
                    translateTime: true,
                    ignore: 'pid,hostname'
                }
            };
        }

        this.logger = pino(config, pino.destination());
    }

    levelPlusPlus() {
        this.debug = this.info;
        this.info = this.warn;
        this.warn = this.error;
        this.error = this.fatal;
    }

    debug(msg: string, ...args: any[]): void {
        this.logger['debug'](msg, ...args);
    }

    info(msg: string, ...args: any[]): void {
        this.logger['info'](msg, ...args);
    }

    warn(msg: string, ...args: any[]): void {
        this.logger['warn'](msg, ...args);
    }

    error(msg: string, ...args: any[]): void {
        this.logger['error'](msg, ...args);
    }

    fatal(msg: string, ...args: any[]): void {
        this.logger['error'](msg, ...args);
    }
}
