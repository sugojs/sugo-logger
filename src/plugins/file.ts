import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { levelKeys } from '../Logger';
import * as trace from '../trace';
import { ILoggerPlugin } from './LoggerPlugin';

export interface IFileLoggerPlugInOptions {
  path?: string;
  filename?: string;
  daily?: boolean;
  fileExtension?: string;
}

export class FileLoggerPlugIn implements ILoggerPlugin {
  public path: string = './logs';
  public filename: string = 'log';
  public daily: boolean = false;
  public fileExtension: string = 'txt';

  constructor(options: IFileLoggerPlugInOptions = {}) {
    this.path = options.path ? options.path : this.path;
    this.path += this.path.endsWith(path.sep) ? '' : path.sep;
    this.path = path.normalize(this.path);
    this.filename = options.filename ? options.filename : this.filename;
    this.fileExtension = options.fileExtension ? options.fileExtension : this.fileExtension;
    this.daily = options.daily ? options.daily : this.daily;
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
    return path.format({
      dir: this.path,
      name: this.daily ? this.filename + '_' + this.getDate() : this.filename,
      ext: this.fileExtension,
    });
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

  public async writeToFile(level: string, message: string, date: Date) {
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

  public trace(message: string, date: Date) {
    try {
      this.writeToFile(levelKeys.TRACE, trace.get(message), date);
    } catch (error) {
      this.handleError(error);
    }
  }

  public debug(message: string, date: Date) {
    try {
      this.writeToFile(levelKeys.DEBUG, message, date);
    } catch (error) {
      this.handleError(error);
    }
  }

  public info(message: string, date: Date) {
    try {
      this.writeToFile(levelKeys.INFO, message, date);
    } catch (error) {
      this.handleError(error);
    }
  }

  public warn(message: string, date: Date) {
    try {
      this.writeToFile(levelKeys.WARN, message, date);
    } catch (error) {
      this.handleError(error);
    }
  }

  public error(message: string, date: Date) {
    try {
      this.writeToFile(levelKeys.ERROR, message, date);
    } catch (error) {
      this.handleError(error);
    }
  }

  public fatal(message: string, date: Date) {
    try {
      this.writeToFile(levelKeys.FATAL, message, date);
    } catch (error) {
      this.handleError(error);
    }
  }

  public handleError(error: Error) {
    console.error(`There has been an error in the logger. Using the ${this.constructor.name} plugin: `, error);
  }
}
