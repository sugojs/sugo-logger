# **@sugo/logger**

Plugin based logger to be used in multiple applications. It's philosophy is to be a 'glue' or 'container' for different types of **plugins** that do all the hard work. The Logger creates the log date and the message to be logged and gives them to the plugins.

## **Requirements**

node version >= 9.11.2

## **How to install**

```shell
npm install --save @sugo/logger
```

## **Logger**

---

Base object to which the plugins will be attached.

### **options**

- **level:** Log level to which to write logs. It follows the [Log4J](https://logging.apache.org/log4j/2.x/) rules for levels. All levels have a numeric value associated to them, if the logger level is higher than a requested level, it will not be logged. This module contains a levels object to help readability when assigning levels.

```json
{
  "ALL": 0,
  "TRACE": 1,
  "DEBUG": 2,
  "INFO": 3,
  "WARN": 4,
  "ERROR": 5,
  "FATAL": 6,
  "OFF": 7
}
```

```typescript
import { Logger } from '@sugo/logger';
import { ConsoleLoggerPlugIn } from '@sugo/logger/plugins/console';
import { ElasticSearchRestLoggerPlugIn } from '@sugo/logger/plugins/elasticSearchRest';
import { FileLoggerPlugIn } from '@sugo/logger/plugins/file';

import { Logger, levels } from '../logger';
import { ConsoleLoggerPlugIn } from '../plugins';
// It will only print FATAL logs
const logger = new Logger({ level: levels.FATAL, plugins: [new ConsoleLoggerPlugIn()] });
```

- **transports:** Color to be used for the log tag in the trace method.

## **ConsoleLoggerPlugIn**

---

A simple logger that logs to the console. Has a default color scheme that can be customtized. The exportd colors object contains the different colors that can be assigned.

### **options**

- **resetColor:** Default text color.

- **traceColor:** Color to be used for the log tag in the trace method.

- **debugColor:** Color to be used for the debug tag in the debug method.

- **infoColor:** Color to be used for the debug tag in the info method.

- **warnColor:** Color to be used for the warn tag in the warn method.

- **errorColor:** Color to be used for the error tag in the error method.

- **fatalColor:** Color to be used for the error tag in the fatal method.

```typescript
const { ConsoleLoggerPlugIn, colors } = require('@sugo/logger/plugins/console');
const consolePlugin = new ConsoleLoggerPlugIn({
  infoColor: colors.FgBlack,
});
```

## **ElasticSearchRestLoggerPlugIn**

---

Logs to an elastic search index.

this.host = options.host || "http://localhost";
this.port = options.port || 9200;
this.index = options.index;
this.type = options.type || "logs";

### **options**

- **host:** Elastic search server host url. **Default:** http://localhost.

- **port:** Elastic search server port. **Default:** 9200.

- **index:** Elastic search index name. **Required**.

- **type:** Elastic search mapping type. **Default:** 'logs'.

## **FileLoggerPlugIn**

---

Logs to a file. Can be set to log to a different file daily.

### **options**

- **path:** The path where the logs will be created. **Default:** './logs/'.

- **filename:** The name of the file. **Default:** 'log.txt'.

- **daily:** Boolean that defines if there must be a file for each day. If set to **true** then it will append the date to the filename name. Example 'logs-28-10-1991.txt **Default:** false.

## **Writing a Custom Plugin**

---

To write a custom plugin, just create an object that implementes the following methods:

- **trace(message, date)**

- **debug(message, date)**

- **info(message, date)**

- **warn(message, date)**

- **error(message, date)**

- **fatal(message, date)**

**NOTE 1:** The message and date will be passed down from the Logger object.

**NOTE 2:** As the logger is not meant to stop the execution of most applications, a handleError(err) method that captures all errors is recommended.

## **Complete Application Example**

---

```typescript
import { Logger } from '@sugo/logger';
import { ConsoleLoggerPlugIn } from '@sugo/logger/plugins/console';
import { ElasticSearchRestLoggerPlugIn } from '@sugo/logger/plugins/elasticSearchRest';
import { FileLoggerPlugIn } from '@sugo/logger/plugins/file';

const logger = new Logger();
const consolePlugin = new ConsoleLoggerPlugIn();
const elasticPlugin = new ElasticSearchRestLoggerPlugIn({
  host: 'http://localhost',
  port: 9200,
  index: 'sugo-logger-test',
  type: 'logs',
});
const filePlugin = new FileLoggerPlugIn({
  path: './logs/',
  filename: 'test.log',
  daily: true,
});
logger
  .addPlugin(consolePlugin)
  .addPlugin(elasticPlugin)
  .addPlugin(filePlugin);

logger.trace('Hello', 'World');
logger.debug('Hello', 'World');
logger.info('Hello', 'World');
logger.warn('Hello', 'World');
logger.error('Hello', 'World');
logger.fatal('Hello', 'World');
```
