/* eslint class-methods-use-this: 'off' */
/* global window, document */

import Logger from 'nightingale-logger';
import { EventEmitter } from 'events';
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

  let body = ctx.body;
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

let Application = class extends EventEmitter {

  constructor() {
    super();
    this.middleware = [];
    this.context = Object.create(context);
    this.context.app = this;
    this.context.state = {};
  }

  get environment() {
    return this.env;
  }

  use(fn) {
    logger.debug('use', { name: fn.name || '-' });
    this.middleware.push(fn);
    return this;
  }

  onerror(e) {
    logger.error(e);
  }

  run(url) {
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

  load(url) {
    var _this = this;

    logger.debug('load', { url });

    if (url.startsWith('?')) {
      url = window.location.pathname + url;
    }

    const context = this.createContext();
    return this.callback(context).then(function () {
      return respond(context);
    }).catch(function (err) {
      return _this.emit('error', err);
    });
  }
};
export { Application as default };
//# sourceMappingURL=index.js.map