import type { IncomingMessage, Server, ServerResponse } from 'node:http';
import path from 'node:path';
import { deprecate } from 'node:util';
import Koa from 'koa';
import type { ParameterizedContext, DefaultState } from 'koa';
import compress from 'koa-compress';
import serve from 'koa-static';
import { Logger } from 'nightingale-logger';
import type { Router } from 'router-segments';
import type { Config } from './config';
import _config from './config';
import errors from './errors';
import type { AlpLanguageContext } from './language';
import language from './language';
import _listen from './listen';
import type { AlpParamsContext, AlpParamsRequest } from './params';
import params from './params';
import type {
  AlpRouteRef,
  RouterContext as AlpRouterContext,
  UrlGenerator,
} from './router';
import type { TranslateBaseContext, TranslateContext } from './translate';
import translate from './translate';
import type {
  NodeApplication,
  NodeConfig,
  Context as AlpContext,
  ContextState,
  ContextSanitizedState,
} from './types';

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

  interface DefaultContext
    extends AlpContext,
      AlpParamsContext,
      AlpRouterContext,
      AlpLanguageContext,
      TranslateContext {}

  interface BaseContext extends AlpContext, TranslateBaseContext {
    urlGenerator: UrlGenerator;
    redirectTo: <P extends Record<string, unknown>>(
      to: string,
      params?: P,
    ) => void;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface BaseRequest extends AlpParamsRequest {}
}

export class AlpNodeApp extends Koa<ContextState> implements NodeApplication {
  dirname: string;

  certPath: string;

  publicPath: string;

  config: Config & NodeConfig;

  _server?: Server;

  router?: Router<any, AlpRouteRef>;

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

  override createContext<StateT = DefaultState>(
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

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  override listen(): never {
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

export { type NodeApplication } from './types';
