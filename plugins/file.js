const fs = require("fs");
const os = require("os");

class FileLoggerPlugIn {
  constructor(options = {}) {
    this.path = options.path || "./logs/";
    this.filename = options.filename || "log.txt";
    this.daily = options.daily || false;
  }

  getDate() {
    const now = new Date();
    let month = now.getMonth();
    month = month < 9 ? "0" + month.toString() : month.toString();
    let day = now.getDate();
    day = day < 10 ? "0" + day.toString() : day.toString();
    return `${now.getFullYear()}-${month}-${day}`;
  }

  getFilepath() {
    return [this.path, this.filename, this.daily ? "_" + this.getDate() : "", ".txt"].join("");
  }

  writeToFile(level, message, date) {
    const self = this;
    fs.mkdir(this.path, null, err => {
      if (err && err.code != "EEXIST") return self.handleError(err);
      const string = `${date.toISOString()} ${level}: ${message}${os.EOL}`;
      fs.appendFile(this.getFilepath(), string, {}, err => {
        if (err) return self.handleError(err);
      });
    });
  }

  log(message, date) {
    try {
      this.writeToFile("log", message, date);
    } catch (error) {
      this.handleError(error);
    }
  }

  info(message, date) {
    try {
      this.writeToFile("info", message, date);
    } catch (error) {
      this.handleError(error);
    }
  }

  debug(message, date) {
    try {
      this.writeToFile("debug", message, date);
    } catch (error) {
      this.handleError(error);
    }
  }

  warn(message, date) {
    try {
      this.writeToFile("warn", message, date);
    } catch (error) {
      this.handleError(error);
    }
  }

  error(message, date) {
    try {
      this.writeToFile("error", message, date);
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error) {
    console.error(`There has been an error in the logger. Using the ${this.constructor.name} plugin: `, error);
  }
}

module.exports = {
  FileLoggerPlugIn
};
