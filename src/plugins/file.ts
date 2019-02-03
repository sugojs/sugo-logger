import * as fs from 'fs';
import * as os from 'os';
import { LoggerLevel } from '..';

export interface IFileLoggerPlugInOptions {
  path?: string;
  filename?: string;
  daily?: boolean;
}

export default class FileLoggerPlugIn {
  public path: string;
  public filename: string;
  public daily: boolean;

  constructor(options: IFileLoggerPlugInOptions = {}) {
    this.path = options.path || './logs/';
    this.filename = options.filename || 'log.txt';
    this.daily = options.daily || false;
  }

  public getDate() {
    const now = new Date();
    const month = now.getMonth();
    const monthString = month < 9 ? '0' + month.toString() : month.toString();
    const day = now.getDate();
    const dayString = day < 10 ? '0' + day.toString() : day.toString();
    return `${now.getFullYear()}-${monthString}-${dayString}`;
  }

  public getFilepath() {
    return [this.path, this.filename, this.daily ? '_' + this.getDate() : '', '.txt'].join('');
  }

  public writeToFile(level: LoggerLevel, message: string, date: Date) {
    const self = this;
    fs.mkdir(this.path, null, (err: any) => {
      if (err && err.code !== 'EEXIST') {
        return self.handleError(err);
      }
      const log = `${date.toISOString()} ${level}: ${message}${os.EOL}`;
      fs.appendFile(this.getFilepath(), log, {}, (appendError: any) => {
        if (err) {
          return self.handleError(err);
        }
      });
    });
  }

  public log(message: string, date: Date) {
    try {
      this.writeToFile('log', message, date);
    } catch (error) {
      this.handleError(error);
    }
  }

  public info(message: string, date: Date) {
    try {
      this.writeToFile('info', message, date);
    } catch (error) {
      this.handleError(error);
    }
  }

  public debug(message: string, date: Date) {
    try {
      this.writeToFile('debug', message, date);
    } catch (error) {
      this.handleError(error);
    }
  }

  public warn(message: string, date: Date) {
    try {
      this.writeToFile('warn', message, date);
    } catch (error) {
      this.handleError(error);
    }
  }

  public error(message: string, date: Date) {
    try {
      this.writeToFile('error', message, date);
    } catch (error) {
      this.handleError(error);
    }
  }

  public handleError(error: Error) {
    console.error(`There has been an error in the logger. Using the ${this.constructor.name} plugin: `, error);
  }
}
