import * as assert from 'assert';
import * as http from 'http';
import { ILoggerPlugin } from '.';
import { levelKeys } from '../Logger';
import * as trace from '../trace';

export interface IElasticSearchRestLoggerPlugInOptions {
  index: string;
  host?: string;
  port?: number;
  type?: string;
}

export class ElasticSearchRestLoggerPlugIn implements ILoggerPlugin {
  public index: string;
  public host?: string;
  public port?: number;
  public type?: string;

  constructor(options: IElasticSearchRestLoggerPlugInOptions) {
    assert(options.index, "The 'index' option is required");
    assert(typeof options.index === 'string', "The 'index' option must be a string");
    assert(!options.host || typeof options.host === 'string', "The 'host' option must be a string");
    assert(!options.port || typeof options.port === 'number', "The 'port' option must be a number");
    assert(!options.type || typeof options.type === 'string', "The 'type' option must be a string");
    this.host = options.host || 'http://localhost';
    this.port = options.port || 9200;
    this.index = options.index;
    this.type = options.type || 'logs';
  }

  public postToElasticSearch(level: string, message: string, timestamp: Date) {
    const self = this;
    const { host, index, port, type } = self;
    const data = {
      level,
      message,
      timestamp,
    };
    const url: string = `${host}:${port}/${index}/${type}`;
    const options: http.RequestOptions = {
      method: 'POST',
    };

    const req = http.request(url, options, (res: http.IncomingMessage) => {
      let rawBody = Buffer.from('');
      let body;
      res.on('data', (chunk: any) => {
        rawBody = Buffer.concat([rawBody, chunk]);
      });
      res.on('end', () => {
        try {
          body = JSON.parse(rawBody.toString());
        } catch (e) {
          body = { detail: rawBody.toString() };
        }
        if ((res.statusCode as number) < 200 || (res.statusCode as number) >= 300) {
          self.handleError(body);
        }
      });
    });
    req.on('error', (err: Error) => {
      self.handleError(err);
    });
    req.write(JSON.stringify(data));
    req.end();
  }

  public trace(message: string, date: Date) {
    try {
      this.postToElasticSearch(levelKeys.TRACE, trace.get(message), date);
    } catch (error) {
      this.handleError(error);
    }
  }

  public debug(message: string, date: Date) {
    try {
      this.postToElasticSearch(levelKeys.DEBUG, message, date);
    } catch (error) {
      this.handleError(error);
    }
  }

  public info(message: string, date: Date) {
    try {
      this.postToElasticSearch(levelKeys.INFO, message, date);
    } catch (error) {
      this.handleError(error);
    }
  }

  public warn(message: string, date: Date) {
    try {
      this.postToElasticSearch(levelKeys.WARN, message, date);
    } catch (error) {
      this.handleError(error);
    }
  }

  public error(message: string, date: Date) {
    try {
      this.postToElasticSearch(levelKeys.ERROR, message, date);
    } catch (error) {
      this.handleError(error);
    }
  }

  public fatal(message: string, date: Date) {
    try {
      this.postToElasticSearch(levelKeys.FATAL, message, date);
    } catch (error) {
      this.handleError(error);
    }
  }

  public handleError(error: Error) {
    const backUpLogger = console;
    backUpLogger.error(`There has been an error in the logger. Using the ${this.constructor.name} plugin: `, error);
  }
}
