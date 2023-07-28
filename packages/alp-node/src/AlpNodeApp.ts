import type { IncomingMessage, Server, ServerResponse } from 'node:http';
import path from 'node:path';
import { deprecate } from 'node:util';
import _listen from 'alp-listen';
import type { Config } from 'alp-node-config';
import _config from 'alp-node-config';
import errors from 'alp-node-errors';
import language from 'alp-node-language';
import params from 'alp-params';
import translate from 'alp-translate';
import type {
  NodeApplication,
  NodeConfig,
  Context as AlpContext,
  ContextState,
  ContextSanitizedState,
  ContextRequest,
} from 'alp-types';
import Koa from 'koa';
import type { ParameterizedContext, DefaultState, BaseRequest } from 'koa';
import compress from 'koa-compress';
import serve from 'koa-static';
import { Logger } from 'nightingale-logger';

const logger = new Logger('alp');

export interface AlpNodeAppOptions {
  appDirname: string;
  packageDirname: string;
  config: Config & NodeConfig;
  certPath?: string;
  publicPath?: string;
}

declare module 'koa' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-shadow
  interface DefaultState extends ContextState {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultContext extends AlpContext {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface BaseContext extends AlpContext {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-shadow
  interface BaseRequest extends ContextRequest {}
}

export class AlpNodeApp extends Koa<ContextState> implements NodeApplication {
  dirname: string;

  certPath: string;

  publicPath: string;

  config: Config & NodeConfig;

  declare request: BaseRequest & ContextRequest;

  _server?: Server;

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

  existsConfigSync(name: string): ReturnType<Config['existsConfigSync']> {
    return this.config.existsConfigSync(name);
  }

  loadConfigSync(name: string): ReturnType<Config['loadConfigSync']> {
    return this.config.loadConfigSync(name);
  }

  createContext<StateT = DefaultState>(
    req: IncomingMessage,
    res: ServerResponse,
  ): ParameterizedContext<StateT> {
    const ctx = super.createContext<StateT>(req, res);
    ctx.sanitizedState = {} as ContextSanitizedState;
    return ctx;
  }

  servePublic(): void {
    this.use(serve(this.publicPath)); // static files
  }

  catchErrors(): void {
    this.use(errors);
  }

  listen(): Server {
    throw new Error('Use start instead');
  }

  /**
   * Close server and emit close event
   */
  close(): void {
    if (this._server) {
      this._server.close();
      this.emit('close');
    }
  }

  async start(fn: () => Promise<void> | void): Promise<Server> {
    await fn();
    try {
      const server = await _listen(this.config, this.callback(), this.certPath);
      this._server = server;
      logger.success('started');
      if (process.send) process.send('ready');
      return server;
    } catch (error: unknown) {
      logger.error('start fail', { err: error });
      throw error;
    }
  }
}

export type { Context } from 'koa';
