import { existsSync, readFileSync } from 'fs';
import { IncomingMessage, Server, ServerResponse } from 'http';
import path from 'path';
import { deprecate } from 'util';
import Koa, { BaseContext } from 'koa';
import compress from 'koa-compress';
import serve from 'koa-static';
import _config, { Config } from 'alp-node-config';
import errors from 'alp-node-errors';
import params from 'alp-params';
import language from 'alp-node-language';
import translate from 'alp-translate';
import _listen from 'alp-listen';
import Logger from 'nightingale-logger';
import findUp from 'findup-sync';
import { NodeApplication, NodeConfig, Context as AlpContext } from 'alp-types';

export { Config };

const logger = new Logger('alp');

// see alp-dev
export const appDirname = path.resolve('build');

const packagePath = findUp('package.json', { cwd: appDirname });
if (!packagePath) {
  throw new Error(`Could not find package.json: "${packagePath}"`);
}
export const packageDirname = path.dirname(packagePath);

logger.debug('init', { appDirname, packageDirname });

// eslint-disable-next-line import/no-dynamic-require, global-require
export const packageConfig = JSON.parse(readFileSync(packagePath, 'utf-8'));

const buildedConfigPath = `${appDirname}/build/config/`;
const configPath = existsSync(buildedConfigPath)
  ? buildedConfigPath
  : `${appDirname}/config/`;
export const config = new Config(configPath).loadSync({ packageConfig });

interface Options {
  certPath?: string;
  publicPath?: string;
}

declare module 'koa' {
  interface BaseContext extends AlpContext {}
}

export type Context = AlpContext;

export default class Alp extends Koa implements NodeApplication {
  dirname: string;

  certPath: string;

  publicPath: string;

  config: NodeConfig & Config;

  _server?: Server;

  context!: BaseContext & AlpContext;

  /**
   * @param {Object} [options]
   * @param {string} [options.certPath] directory of the ssl certificates
   * @param {string} [options.publicPath] directory of public files
   */
  constructor(options: Options = {}) {
    super();

    this.dirname = path.normalize(appDirname);

    Object.defineProperty(this, 'packageDirname', {
      get: deprecate(() => packageDirname, 'packageDirname'),
      configurable: false,
      enumerable: false,
    });

    this.certPath = options.certPath || `${packageDirname}/config/cert`;
    this.publicPath = options.publicPath || `${packageDirname}/public/`;

    this.config = _config(this, config);
    this.context.config = this.config;

    params(this);
    language(this);
    translate('locales')(this);

    this.use(compress());
  }

  existsConfigSync(name: string) {
    return config.existsConfigSync(name);
  }

  loadConfigSync(name: string) {
    return config.loadConfigSync(name);
  }

  get environment() {
    deprecate(() => () => null, 'app.environment, use app.env instead')();
    return this.env;
  }

  get production() {
    deprecate(
      () => () => null,
      'app.production, use global.PRODUCTION instead',
    )();
    return this.env === 'prod' || this.env === 'production';
  }

  createContext(req: IncomingMessage, res: ServerResponse) {
    const ctx = super.createContext(req, res);
    ctx.sanitizedState = {};
    return ctx;
  }

  servePublic() {
    this.use(serve(this.publicPath)); // static files
  }

  catchErrors() {
    this.use(errors);
  }

  listen(): Server {
    throw new Error('Use start instead');
  }

  /**
   * Close server and emit close event
   */
  close() {
    if (this._server) {
      this._server.close();
      this.emit('close');
    }
  }

  async start(fn: Function): Promise<Server> {
    await fn();
    try {
      const server = await _listen(this.config, this.callback(), this.certPath);
      this._server = server;
      logger.success('started');
      if (process.send) process.send('ready');
      return server;
    } catch (err) {
      logger.error('start fail', { err });
      throw err;
    }
  }
}
