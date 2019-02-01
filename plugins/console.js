const colors = {
  /* Special */
  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  Dim: "\x1b[2m",
  Underscore: "\x1b[4m",
  Blink: "\x1b[5m",
  Reverse: "\x1b[7m",
  Hidden: "\x1b[8m",
  /* Font */
  FgBlack: "\x1b[30m",
  FgRed: "\x1b[31m",
  FgGreen: "\x1b[32m",
  FgYellow: "\x1b[33m",
  FgBlue: "\x1b[34m",
  FgMagenta: "\x1b[35m",
  FgCyan: "\x1b[36m",
  FgWhite: "\x1b[37m",
  /* Background */
  BgBlack: "\x1b[40m",
  BgRed: "\x1b[41m",
  BgGreen: "\x1b[42m",
  BgYellow: "\x1b[43m",
  BgBlue: "\x1b[44m",
  BgMagenta: "\x1b[45m",
  BgCyan: "\x1b[46m",
  BgWhite: "\x1b[47m"
};

class ConsoleLoggerPlugIn {
  constructor(options = {}) {
    this.resetColor = options.resetColor || colors.Reset;
    this.logColor = options.logColor || colors.FgMagenta;
    this.infoColor = options.infoColor || colors.FgGreen;
    this.debugColor = options.debugColor || colors.FgBlue;
    this.warnColor = options.warnColor || colors.FgYellow;
    this.errorColor = options.errorColor || colors.FgRed;
  }

  log(message, date) {
    try {
      const string = [`${date.toISOString()}`, this.logColor, `log:`, this.resetColor, message];
      console.log(...string);
    } catch (error) {
      this.handleError(error);
    }
  }

  info(message, date) {
    try {
      const string = [`${date.toISOString()}`, this.infoColor, `info:`, this.resetColor, message];
      console.info(...string);
    } catch (error) {
      this.handleError(error);
    }
  }

  debug(message, date) {
    try {
      const string = [`${date.toISOString()}`, this.debugColor, `debug:`, this.resetColor, message];
      console.debug(...string);
    } catch (error) {
      this.handleError(error);
    }
  }

  warn(message, date) {
    try {
      const string = [`${date.toISOString()}`, this.warnColor, `warn:`, this.resetColor, message];
      console.warn(...string);
    } catch (error) {
      this.handleError(error);
    }
  }

  error(message, date) {
    try {
      const string = [`${date.toISOString()}`, this.errorColor, `error:`, this.resetColor, message];
      console.error(...string);
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error) {
    console.error(`There has been an error in the logger. Using the ${this.constructor.name} plugin: `, error);
  }
}

module.exports = {
  colors,
  ConsoleLoggerPlugIn
};
