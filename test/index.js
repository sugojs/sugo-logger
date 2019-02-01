process.on("uncaughtException", err => {
  console.error(err);
  process.abort();
});

const { Logger } = require("../index");
const { ConsoleLoggerPlugIn } = require("../plugins/console");
const { ElasticSearchRestLoggerPlugIn } = require("../plugins/elasticSearchRest");
const { FileLoggerPlugIn } = require("../plugins/file");

const logger = new Logger();
const consolePlugin = new ConsoleLoggerPlugIn();
const elasticPlugin = new ElasticSearchRestLoggerPlugIn({
  host: "http://localhost",
  port: 9200,
  index: "lme-logger-test",
  type: "logs"
});
const filePlugin = new FileLoggerPlugIn({
  path: "./logs/",
  filename: "test.log",
  daily: true
});
logger
  .addPlugin(consolePlugin)
  .addPlugin(elasticPlugin)
  .addPlugin(filePlugin);

logger.log("Hello", "World");
logger.warn("Hello", "World");
logger.error("Hello", "World");
logger.debug("Hello", "World");
logger.info("Hello", "World");
