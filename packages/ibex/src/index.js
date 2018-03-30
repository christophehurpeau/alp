import { EventEmitter } from 'events';
import Logger from 'nightingale-logger';
import compose from './compose';
import context from './context';
import request from './request';
import response from './response';

const logger = new Logger('ibex');

function respond(ctx) {
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
  middleware: Array<Function> = [];
  context: Object = Object.create(context);

  constructor() {
    super();
    this.context.app = this;
    this.context.state = {};
  }

  get environment(): string {
    return this.env;
  }

  use(fn: Function) {
    logger.debug('use', { name: fn.name || '-' });
    this.middleware.push(fn);
    return this;
  }

  onerror(e: any) {
    logger.error(e);
  }

  run(url: mixed) {
    if (!this.listeners('error').length) {
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
    return context;
  }

  load(url: string) {
    logger.debug('load', { url });

    if (url.startsWith('?')) {
      url = window.location.pathname + url;
    }

    const context = this.createContext();
    return this.callback(context)
      .then(() => respond(context))
      .catch(err => this.emit('error', err));
  }
}
