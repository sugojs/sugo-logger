import { Logger } from '..';
import ConsoleLoggerPlugIn from '../plugins/console';
import ElasticSearchRestLoggerPlugIn from '../plugins/elasticSearchRest';
import FileLoggerPlugIn from '../plugins/file';

process.on('uncaughtException', err => {
  console.error(err);
  process.abort();
});

const logger = new Logger();
const consolePlugin = new ConsoleLoggerPlugIn();
const elasticPlugin = new ElasticSearchRestLoggerPlugIn({
  host: 'http://localhost',
  index: 'lme-logger-test',
  port: 9200,
  type: 'logs',
});
const filePlugin = new FileLoggerPlugIn({
  daily: true,
  filename: 'test.log',
  path: './logs/',
});
logger
  .addPlugin(consolePlugin)
  .addPlugin(elasticPlugin)
  .addPlugin(filePlugin);

logger.log('Hello', 'World');
logger.warn('Hello', 'World');
logger.error('Hello', 'World');
logger.debug('Hello', 'World');
logger.info('Hello', 'World');
