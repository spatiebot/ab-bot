import pino from 'pino';

class LoggerConfig {
    static isDevelopment: boolean;
}

class Logger {

    private isDevelopment: boolean;
    private _cachedLogger: pino.Logger;

    private get logger(): pino.Logger {
        if (this._cachedLogger && this.isDevelopment == LoggerConfig.isDevelopment) {
            return this._cachedLogger;
        }

        const config = LoggerConfig.isDevelopment ? {
            level: 'warn',
            prettyPrint: {
                colorize: true,
                translateTime: true,
                ignore: 'pid,hostname'
            }
        } : { level: 'warn' };
        this._cachedLogger = pino(config, pino.destination());
        this.isDevelopment = LoggerConfig.isDevelopment;
        return this._cachedLogger;
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

const logger = new Logger();
export {logger, LoggerConfig}