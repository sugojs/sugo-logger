import { ILoggerPlugin } from '.';
import { levelKeys } from '../Logger';
import * as trace from '../trace';

const colors = {
  /* Special */
  Bright: '\x1b[1m',
  Reset: '\x1b[0m',
  Dim: '\x1b[2m',
  Underscore: '\x1b[4m',
  Blink: '\x1b[5m',
  Reverse: '\x1b[7m',
  Hidden: '\x1b[8m',
  /* Font */
  FgBlack: '\x1b[30m',
  FgRed: '\x1b[31m',
  FgGreen: '\x1b[32m',
  FgYellow: '\x1b[33m',
  FgBlue: '\x1b[34m',
  FgMagenta: '\x1b[35m',
  FgCyan: '\x1b[36m',
  FgWhite: '\x1b[37m',
  /* Background */
  BgBlack: '\x1b[40m',
  BgRed: '\x1b[41m',
  BgGreen: '\x1b[42m',
  BgYellow: '\x1b[43m',
  BgBlue: '\x1b[44m',
  BgMagenta: '\x1b[45m',
  BgCyan: '\x1b[46m',
  BgWhite: '\x1b[47m',
};

export interface IConsoleLoggerPlugInOptions {
  resetColor?: string;
  traceColor?: string;
  debugColor?: string;
  infoColor?: string;
  warnColor?: string;
  errorColor?: string;
  fatalColor?: string;
}

export class ConsoleLoggerPlugIn implements ILoggerPlugin {
  public resetColor: string;
  public traceColor: string;
  public infoColor: string;
  public debugColor: string;
  public warnColor: string;
  public errorColor: string;
  public fatalColor: string;

  constructor(options: IConsoleLoggerPlugInOptions = {}) {
    this.resetColor = options.resetColor || colors.Reset;
    this.traceColor = options.traceColor || colors.FgMagenta;
    this.debugColor = options.debugColor || colors.FgBlue;
    this.infoColor = options.infoColor || colors.FgGreen;
    this.warnColor = options.warnColor || colors.FgYellow;
    this.errorColor = options.errorColor || colors.FgRed;
    this.fatalColor = options.errorColor || colors.BgRed;
  }

  public trace(message: string, date: Date) {
    try {
      const log = [
        `${date.toISOString()}`,
        this.traceColor,
        `${levelKeys.TRACE}:`,
        this.resetColor,
        trace.get(message),
      ];
      console.trace(...log);
    } catch (error) {
      this.handleError(error);
    }
  }

  public debug(message: string, date: Date) {
    try {
      const log = [`${date.toISOString()}`, this.debugColor, `${levelKeys.DEBUG}:`, this.resetColor, message];
      console.debug(...log);
    } catch (error) {
      this.handleError(error);
    }
  }

  public info(message: string, date: Date) {
    try {
      const log = [`${date.toISOString()}`, this.infoColor, `${levelKeys.INFO}:`, this.resetColor, message];
      console.info(...log);
    } catch (error) {
      this.handleError(error);
    }
  }

  public warn(message: string, date: Date) {
    try {
      const log = [`${date.toISOString()}`, this.warnColor, `${levelKeys.WARN}:`, this.resetColor, message];
      console.warn(...log);
    } catch (error) {
      this.handleError(error);
    }
  }

  public error(message: string, date: Date) {
    try {
      const log = [`${date.toISOString()}`, this.errorColor, `${levelKeys.ERROR}:`, this.resetColor, message];
      console.error(...log);
    } catch (error) {
      this.handleError(error);
    }
  }

  public fatal(message: string, date: Date) {
    try {
      const log = [`${date.toISOString()}`, this.fatalColor, `${levelKeys.FATAL}:`, this.resetColor, message];
      console.error(...log);
    } catch (error) {
      this.handleError(error);
    }
  }

  public handleError(error: Error) {
    console.error(`There has been an error in the logger. Using the ${this.constructor.name} plugin: `, error);
  }
}
