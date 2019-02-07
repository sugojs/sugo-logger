import * as fs from 'fs';
import * as os from 'os';
import { normalize, sep } from 'path';
import { ILoggerPlugin } from '.';

export type LoggerLevel = 'log' | 'info' | 'debug' | 'warn' | 'error';
export interface IFileLoggerPlugInOptions {
  path?: string;
  filename?: string;
  daily?: boolean;
}

export class FileLoggerPlugIn implements ILoggerPlugin {
  public path: string;
  public filename: string;
  public daily: boolean;

  constructor(options: IFileLoggerPlugInOptions = {}) {
    this.path = options.path || './logs/';
    this.path = normalize(this.path);
    this.path += this.path.endsWith('/') ? '' : sep;
    this.filename = options.filename || 'log.txt';
    this.daily = options.daily || false;
    if (!fs.existsSync(this.path)) {
      fs.mkdirSync(this.path);
    }
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

  public appendToFile(message: string) {
    return new Promise<any>((resolve, reject) => {
      fs.appendFile(this.getFilepath(), message, (err?: NodeJS.ErrnoException) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  public async writeToFile(level: LoggerLevel, message: string, date: Date) {
    try {
      const log = `${date.toISOString()} ${level}: ${message}${os.EOL}`;
      await this.appendToFile(log);
    } catch (error) {
      this.handleError(error);
    }
  }

  public async wait(milliseconds: number) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, milliseconds);
    });
  }

  public log(message: string, date: Date) {
    this.writeToFile('log', message, date);
  }

  public info(message: string, date: Date) {
    this.writeToFile('info', message, date);
  }

  public debug(message: string, date: Date) {
    this.writeToFile('debug', message, date);
  }

  public warn(message: string, date: Date) {
    this.writeToFile('warn', message, date);
  }

  public error(message: string, date: Date) {
    this.writeToFile('error', message, date);
  }

  public handleError(error: Error) {
    console.error(`There has been an error in the logger. Using the ${this.constructor.name} plugin: `, error);
  }
}
