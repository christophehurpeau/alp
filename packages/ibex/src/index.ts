import { EventEmitter } from 'events';
import type { BaseContext as KoaBaseContext } from 'koa';
import Logger from 'nightingale-logger';
import type { Composed, Middleware as ComposeMiddleware } from './compose';
import compose from './compose';
import context from './context';
import type { Request } from './request';
import request from './request';
import type { Response } from './response';
import response from './response';

export interface BaseContext extends KoaBaseContext {
  app: Application;
  redirect: (url: string) => Promise<void>;
}
export interface DefaultState {}
export interface DefaultSanitizedState {}

export interface Context extends BaseContext {
  request: Request;
  response: Response;
  req: never;
  res: never;
  originalUrl: string;
  cookies: never;
  state: DefaultState;
  sanitizedState: DefaultSanitizedState;
  respond?: boolean;
}

export type Middleware = ComposeMiddleware<Context>;

const logger = new Logger('ibex');

function respond(ctx: Context): void {
  // allow bypassing
  if (ctx.respond === false) {
    return;
  }

  const body: unknown = ctx.body;
  if (body == null) return;

  // const code = ctx.status;

  if (typeof body === 'string') {
    document.body.innerHTML = body;
    return;
  }

  if ((body as Node).nodeType) {
    document.body.innerHTML = '';
    document.body.append(body as Node);
  }

  throw new Error('Invalid body result');
}

export default class Application extends EventEmitter {
  middleware: Middleware[] = [];

  context: BaseContext = Object.create(context) as BaseContext;

  callback?: Composed<Context>;

  constructor() {
    super();
    this.context.app = this;
  }

  use(fn: Middleware): this {
    logger.debug('use', { name: fn.name || '-' });
    this.middleware.push(fn);
    return this;
  }

  onerror(e: any): void {
    logger.error(e);
  }

  run(url?: string): void {
    if (this.listeners('error').length === 0) {
      this.on('error', this.onerror);
    }

    this.callback = compose(this.middleware);

    if (url) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.load(url);
    }
  }

  createContext(): Context {
    const context: Context = Object.create(this.context) as Context;
    context.request = Object.create(request) as Request;
    context.response = Object.create(response) as Response;
    Object.assign(context.request, { app: this });
    Object.assign(context.response, { app: this });
    context.state = {};
    context.sanitizedState = {};
    return context;
  }

  load(url: string): Promise<void> {
    logger.debug('load', { url });

    if (url.startsWith('?')) {
      url = window.location.pathname + url;
    }

    if (!this.callback) {
      throw new Error('You should call load() after run()');
    }

    const context = this.createContext();
    return this.callback(context)
      .then(() => respond(context))
      .catch((err) => {
        this.emit('error', err);
      });
  }
}
