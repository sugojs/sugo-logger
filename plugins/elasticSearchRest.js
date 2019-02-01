const assert = require("assert");
const http = require("http");

class ElasticSearchRestLoggerPlugIn {
  constructor(options = {}) {
    assert(options.index, "The 'index' option is required");
    assert(typeof options.index === "string", "The 'index' option must be a string");
    assert(!options.host || typeof options.host === "string", "The 'host' option must be a string");
    assert(!options.port || typeof options.port === "number", "The 'port' option must be a number");
    assert(!options.type || typeof options.type === "string", "The 'type' option must be a string");
    this.host = options.host || "http://localhost";
    this.port = options.port || 9200;
    this.index = options.index;
    this.type = options.type || "logs";
  }

  postToElasticSearch(level, message, timestamp) {
    const self = this;
    const { host, index, port, type } = self;
    const data = {
      level,
      message,
      timestamp
    };
    const url = `${host}:${port}/${index}/${type}`;
    const options = {
      method: "POST"
    };

    var req = http.request(url, options, res => {
      let rawBody = Buffer.from("");
      let body;
      res.on("data", function(chunk) {
        rawBody = Buffer.concat([rawBody, chunk]);
      });
      res.on("end", function() {
        rawBody = rawBody.toString();
        try {
          body = JSON.parse(rawBody);
        } catch (e) {
          body = { detail: rawBody };
        }
        if (res.statusCode < 200 || res.statusCode >= 300) {
          self.handleError(body);
        }
      });
    });
    req.on("error", function(err) {
      self.handleError(err);
    });
    req.write(JSON.stringify(data));
    req.end();
  }

  log(message, date) {
    try {
      this.postToElasticSearch("log", message, date);
    } catch (error) {
      this.handleError(error);
    }
  }

  info(message, date) {
    try {
      this.postToElasticSearch("info", message, date);
    } catch (error) {
      this.handleError(error);
    }
  }

  debug(message, date) {
    try {
      this.postToElasticSearch("debug", message, date);
    } catch (error) {
      this.handleError(error);
    }
  }

  warn(message, date) {
    try {
      this.postToElasticSearch("warn", message, date);
    } catch (error) {
      this.handleError(error);
    }
  }

  error(message, date) {
    try {
      this.postToElasticSearch("error", message, date);
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error) {
    console.error(`There has been an error in the logger. Using the ${this.constructor.name} plugin: `, error);
  }
}

module.exports = {
  ElasticSearchRestLoggerPlugIn
};
