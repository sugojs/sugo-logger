class Logger {
  constructor(options = {}) {
    this.plugins = Array.isArray(options.plugins) ? [].concat(options.plugins) : [];
  }

  addPlugin(plugin) {
    this.plugins.push(plugin);
    return this;
  }

  getTimestamp() {
    return new Date();
  }

  getMessage(...args) {
    return args.join(" ");
  }

  log(...args) {
    const date = this.getTimestamp();
    const message = this.getMessage(...args);
    for (const plugin of this.plugins) {
      plugin.log(message, date);
    }
  }

  info(...args) {
    const date = this.getTimestamp();
    const message = this.getMessage(...args);
    for (const plugin of this.plugins) {
      plugin.info(message, date);
    }
  }

  debug(...args) {
    const date = this.getTimestamp();
    const message = this.getMessage(...args);
    for (const plugin of this.plugins) {
      plugin.debug(message, date);
    }
  }

  warn(...args) {
    const date = this.getTimestamp();
    const message = this.getMessage(...args);
    for (const plugin of this.plugins) {
      plugin.warn(message, date);
    }
  }

  error(...args) {
    const date = this.getTimestamp();
    const message = this.getMessage(...args);
    for (const plugin of this.plugins) {
      plugin.error(message, date);
    }
  }
}

module.exports = {
  Logger
};
