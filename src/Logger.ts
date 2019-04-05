import * as assert from 'assert';
import { ILoggerPlugin } from './plugins';

export const levelKeys = {
  ALL: 'ALL',
  TRACE: 'TRACE',
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  FATAL: 'FATAL',
  OFF: 'OFF',
};

export const levels = {
  ALL: 0,
  TRACE: 1,
  DEBUG: 2,
  INFO: 3,
  WARN: 4,
  ERROR: 5,
  FATAL: 6,
  OFF: 7,
};

export interface ILoggerOptions {
  plugins?: ILoggerPlugin[];
  level?: number;
}

export class Logger {
  public plugins: ILoggerPlugin[] = [];
  public level: number = 0;

  constructor(options: ILoggerOptions = {}) {
    const { level, plugins } = options;
    assert(
      !level || Object.values(levels).includes(level),
      `The level options must be one of the following values [${Object.values(levels)}], use the levels object`,
    );
    this.level = level ? level : levels.ALL;
    this.plugins = Array.isArray(plugins) ? this.plugins.concat(plugins) : [];
  }

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

  public trace(...args: string[]) {
    if (this.level > levels.TRACE) {
      return;
    }
    const date = this.getTimestamp();
    const message = this.getMessage(...args);
    for (const plugin of this.plugins) {
      plugin.trace(message, date);
    }
  }

  public debug(...args: string[]) {
    if (this.level > levels.DEBUG) {
      return;
    }
    const date = this.getTimestamp();
    const message = this.getMessage(...args);
    for (const plugin of this.plugins) {
      plugin.debug(message, date);
    }
  }

  public info(...args: string[]) {
    if (this.level > levels.INFO) {
      return;
    }
    const date = this.getTimestamp();
    const message = this.getMessage(...args);
    for (const plugin of this.plugins) {
      plugin.info(message, date);
    }
  }

  public warn(...args: string[]) {
    if (this.level > levels.WARN) {
      return;
    }
    const date = this.getTimestamp();
    const message = this.getMessage(...args);
    for (const plugin of this.plugins) {
      plugin.warn(message, date);
    }
  }

  public error(...args: string[]) {
    if (this.level > levels.ERROR) {
      return;
    }
    const date = this.getTimestamp();
    const message = this.getMessage(...args);
    for (const plugin of this.plugins) {
      plugin.error(message, date);
    }
  }

  public fatal(...args: string[]) {
    if (this.level > levels.FATAL) {
      return;
    }
    const date = this.getTimestamp();
    const message = this.getMessage(...args);
    for (const plugin of this.plugins) {
      plugin.fatal(message, date);
    }
  }
}

export default Logger;
