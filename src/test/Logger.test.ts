import * as chai from 'chai';
import * as fs from 'fs';
import { IncomingMessage } from 'http';
import * as path from 'path';
import Logger from '../Logger';
import { ConsoleLoggerPlugIn, ElasticSearchRestLoggerPlugIn, FileLoggerPlugIn } from '../plugins';
interface IElasticSearchResponse {
  hits: {
    hits: any[];
  };
}

const LOGGER_FILE_DIR = './logs/';
const UGLY_DIR = './/examples//';
const http = require('http');
const HOST = 'http://localhost';
const PORT = 9200;
const INDEX = 'lme-logger-test';
const TYPE = 'logs';
const waitInterval = (miliseconds: number) => new Promise(resolve => setTimeout(() => resolve(true), miliseconds));
const deleteIndex = () =>
  new Promise(resolve => {
    const req = http.request(`${HOST}:${PORT}/${INDEX}`, { method: 'DELETE' }, (res: IncomingMessage) => {
      let rawBody = Buffer.from('');
      res.on('data', function(chunk: Buffer) {
        rawBody = Buffer.concat([rawBody, chunk]);
      });
      res.on('end', function() {
        resolve(true);
      });
    });
    req.end();
  });
const getLogs: () => Promise<IElasticSearchResponse> = () =>
  new Promise(resolve => {
    const req = http.get(`${HOST}:${PORT}/${INDEX}/${TYPE}/_search`, {}, (res: IncomingMessage) => {
      let rawBody: Buffer = Buffer.from('');
      res.on('data', (chunk: Buffer) => {
        rawBody = Buffer.concat([rawBody, chunk]);
      });
      res.on('end', () => {
        resolve(JSON.parse(rawBody.toString()));
      });
    });
    req.end();
  });
chai.should();

describe('Simple NodeJS Router', () => {
  after(() => {
    process.exit(0);
  });
  describe(`Constructor`, () => {
    it('It should create a router without arguments', async () => {
      const fn = () => new Logger();
      fn.should.not.throw(Error);
    });
  });
  describe(`addPlugin`, () => {
    it('It should add a route with a OPTIONS method', async () => {
      const logger = new Logger();
      logger.addPlugin(console);
      logger.plugins.length.should.be.eql(1);
    });
  });
  describe(`ConsoleLoggerPlugIn`, () => {
    const consolePlugin = new ConsoleLoggerPlugIn();
    it('It should not fail', async () => {
      const logger = new Logger();
      logger.addPlugin(consolePlugin);
      logger.log('Hello', 'World');
      logger.warn('Hello', 'World');
      logger.error('Hello', 'World');
      logger.debug('Hello', 'World');
      logger.info('Hello', 'World');
    });
  });
  describe(`ElasticSearchRestLoggerPlugIn`, () => {
    const elasticPlugin = new ElasticSearchRestLoggerPlugIn({ host: HOST, port: PORT, index: INDEX, type: TYPE });
    beforeEach(async () => {
      return await deleteIndex();
    });
    it('It should entries on the index', async () => {
      const logger = new Logger();
      logger.addPlugin(elasticPlugin);
      await logger.log('Hello', 'World');
      await logger.warn('Hello', 'World');
      await logger.error('Hello', 'World');
      await logger.debug('Hello', 'World');
      await logger.info('Hello', 'World');
      await waitInterval(1500);
      const logs = await getLogs();
      logs.hits.hits.length.should.be.eql(5);
    });
  });
  describe(`FileLoggerPlugIn`, () => {
    before(() => {
      const normalizedPath = path.normalize(LOGGER_FILE_DIR);
      if (fs.existsSync(normalizedPath)) {
        const files = fs.readdirSync(normalizedPath);
        for (const file of files) {
          fs.unlinkSync(normalizedPath + file);
        }
        fs.rmdirSync(normalizedPath);
      }
      const normalizedUglyPath = path.normalize(UGLY_DIR);
      if (fs.existsSync(normalizedUglyPath)) {
        const files = fs.readdirSync(normalizedUglyPath);
        for (const file of files) {
          fs.unlinkSync(normalizedUglyPath + file);
        }
        fs.rmdirSync(normalizedUglyPath);
      }
    });

    after(() => {
      const normalizedPath = path.normalize(LOGGER_FILE_DIR);
      if (fs.existsSync(normalizedPath)) {
        const files = fs.readdirSync(normalizedPath);
        for (const file of files) {
          fs.unlinkSync(normalizedPath + file);
        }
        fs.rmdirSync(normalizedPath);
      }
      const normalizedUglyPath = path.normalize(UGLY_DIR);
      if (fs.existsSync(normalizedUglyPath)) {
        const files = fs.readdirSync(normalizedUglyPath);
        for (const file of files) {
          fs.unlinkSync(normalizedUglyPath + file);
        }
        fs.rmdirSync(normalizedUglyPath);
      }
    });

    it('it should normalize path', async () => {
      const filePlugin = new FileLoggerPlugIn({ path: UGLY_DIR, filename: 'test', daily: true });
      filePlugin.path.should.be.eql(path.normalize(UGLY_DIR));
    });

    it('it should add a separator at the end if does not have one', async () => {
      const filePlugin = new FileLoggerPlugIn({ path: './logs', filename: 'test.log', daily: true });
      filePlugin.path.should.be.eql('logs' + path.sep);
    });

    it('It should create a dir, a file and write in that file', async () => {
      const filePlugin = new FileLoggerPlugIn({ path: LOGGER_FILE_DIR, filename: 'test.log', daily: true });
      const logger = new Logger();
      logger.addPlugin(filePlugin);
      logger.log('Hello', 'World');
      logger.warn('Hello', 'World');
      logger.error('Hello', 'World');
      logger.debug('Hello', 'World');
      logger.info('Hello', 'World');
      const dirExists = fs.existsSync(LOGGER_FILE_DIR);
      dirExists.should.be.eql(true);
    });
  });
});
