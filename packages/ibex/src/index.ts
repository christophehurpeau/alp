import { EventEmitter } from 'events';
import Logger from 'nightingale-logger';
// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseContext } from 'koa';
import compose, { Composed, Middleware as ComposeMiddleware } from './compose';
import context from './context';
import request, { Request } from './request';
import response, { Response } from './response';

export interface Context extends BaseContext {
  app: Application;
  request: Request;
  response: Response;
  req: never;
  res: never;
  originalUrl: string;
  cookies: never;
  state: { [key: string]: any };
  sanitizedState: { [key: string]: any };
  respond?: boolean;
}

export type Middleware = ComposeMiddleware<Context>;

const logger = new Logger('ibex');

function respond(ctx: Context) {
  // allow bypassing
  if (ctx.respond === false) {
    return;
  }

  const body = ctx.body;
  if (body == null) return;

  // const code = ctx.status;

  if (typeof body === 'string') {
    document.body.innerHTML = body;
    return;
  }

  if (body.nodeType) {
    document.body.innerHTML = '';
    document.body.appendChild(body);
  }

  throw new Error('Invalid body result');
}

export default class Application extends EventEmitter {
  middleware: Middleware[] = [];

  context: Context = Object.create(context);

  callback?: Composed<Context>;

  constructor() {
    super();
    this.context.app = this;
  }

  get environment() {
    throw new Error('use process.env or POB_ENV instead');
  }

  use(fn: Middleware) {
    logger.debug('use', { name: fn.name || '-' });
    this.middleware.push(fn);
    return this;
  }

  onerror(e: any) {
    logger.error(e);
  }

  run(url?: string) {
    if (this.listeners('error').length === 0) {
      this.on('error', this.onerror);
    }

    this.callback = compose(this.middleware);

    if (url) {
      this.load(url);
    }
  }

  createContext() {
    const context = Object.create(this.context);
    context.request = Object.create(request);
    context.response = Object.create(response);
    // eslint-disable-next-line no-multi-assign
    context.request.app = context.response.app = this;
    context.state = {};
    context.sanitizedState = {};
    return context;
  }

  load(url: string) {
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
      .catch((err) => this.emit('error', err));
  }
}
