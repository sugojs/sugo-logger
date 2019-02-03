export type LoggerLevel = 'log' | 'info' | 'debug' | 'warn' | 'error';
export * from './plugins/console';
export * from './plugins/elasticSearchRest';
export * from './plugins/file';
export interface ILoggerPlugin {
  log(message: string, date: Date): void;
  info(message: string, date: Date): void;
  debug(message: string, date: Date): void;
  warn(message: string, date: Date): void;
  error(message: string, date: Date): void;
  handleError(error: Error): void;
}

export class Logger {
  public plugins: ILoggerPlugin[] = [];

  public addPlugin(plugin: ILoggerPlugin) {
    this.plugins.push(plugin);
    return this;
  }

  public getTimestamp() {
    return new Date();
  }

  public getMessage(...args: string[]) {
    return args.join(' ');
  }

  public log(...args: string[]) {
    const date = this.getTimestamp();
    const message = this.getMessage(...args);
    for (const plugin of this.plugins) {
      plugin.log(message, date);
    }
  }

  public info(...args: string[]) {
    const date = this.getTimestamp();
    const message = this.getMessage(...args);
    for (const plugin of this.plugins) {
      plugin.info(message, date);
    }
  }

  public debug(...args: string[]) {
    const date = this.getTimestamp();
    const message = this.getMessage(...args);
    for (const plugin of this.plugins) {
      plugin.debug(message, date);
    }
  }

  public warn(...args: string[]) {
    const date = this.getTimestamp();
    const message = this.getMessage(...args);
    for (const plugin of this.plugins) {
      plugin.warn(message, date);
    }
  }

  public error(...args: string[]) {
    const date = this.getTimestamp();
    const message = this.getMessage(...args);
    for (const plugin of this.plugins) {
      plugin.error(message, date);
    }
  }
}
