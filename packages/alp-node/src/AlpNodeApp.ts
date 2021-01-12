import { IncomingMessage, Server, ServerResponse } from 'http';
import path from 'path';
import { deprecate } from 'util';
import Koa, { BaseContext, DefaultState, ParameterizedContext } from 'koa';
import Logger from 'nightingale-logger';
import compress from 'koa-compress';
import serve from 'koa-static';
import _config, { Config } from 'alp-node-config';
import errors from 'alp-node-errors';
import params from 'alp-params';
import language from 'alp-node-language';
import translate from 'alp-translate';
import _listen from 'alp-listen';
import { NodeApplication, NodeConfig, Context as AlpContext } from 'alp-types';

const logger = new Logger('alp');

export interface AlpNodeAppOptions {
  appDirname: string;
  packageDirname: string;
  config: Config & NodeConfig;
  certPath?: string;
  publicPath?: string;
}

declare module 'koa' {
  interface BaseContext extends AlpContext {}
}

export type Context<State = any, SanitizedState = any> = AlpContext<
  State,
  SanitizedState
> &
  ParameterizedContext<State>;

export class AlpNodeApp extends Koa implements NodeApplication {
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
  constructor({
    appDirname,
    packageDirname,
    config,
    certPath,
    publicPath,
  }: AlpNodeAppOptions) {
    super();

    this.dirname = path.normalize(appDirname);

    Object.defineProperty(this, 'packageDirname', {
      get: deprecate(() => packageDirname, 'packageDirname'),
      configurable: false,
      enumerable: false,
    });

    this.certPath = certPath || `${packageDirname}/config/cert`;
    this.publicPath = publicPath || `${packageDirname}/public/`;

    this.config = _config(this, config);
    this.context.config = this.config;

    params(this);
    language(this);
    translate('locales')(this);

    this.use(compress());
  }

  existsConfigSync(name: string) {
    return this.context.config.existsConfigSync(name);
  }

  loadConfigSync(name: string) {
    return this.context.config.loadConfigSync(name);
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

  createContext<State = DefaultState, SanitizedState = DefaultState>(
    req: IncomingMessage,
    res: ServerResponse,
  ): Context<State, SanitizedState> {
    const ctx: ParameterizedContext<State> = super.createContext<State>(
      req,
      res,
    );
    (ctx as Context<
      State,
      SanitizedState
    >).sanitizedState = {} as SanitizedState;
    return ctx as Context<State, SanitizedState>;
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
