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


  // const code = ctx.status;

  if (ctx.respond !== false) {

      let body = ctx.body;
      if (body != null) {
          if (typeof body === 'string') return void (document.body.innerHTML = body);

          throw body.nodeType && (document.body.innerHTML = '', document.body.appendChild(body)), new Error('Invalid body result');
        }
    }
}

let Application = class extends EventEmitter {

  constructor() {
    super(), this.middleware = [], this.context = Object.create(context), this.context.app = this, this.context.state = {};
  }

  get environment() {
    return this.env;
  }

  use(fn) {
    return logger.debug('use', { name: fn.name || '-' }), this.middleware.push(fn), this;
  }

  onerror(e) {
    logger.error(e);
  }

  run(url) {
    this.listeners('error').length || this.on('error', this.onerror), this.callback = compose(this.middleware), url && this.load(url);
  }

  createContext() {
    const context = Object.create(this.context);

    return context.request = Object.create(request), context.response = Object.create(response), context.request.app = context.response.app = this, context;
  }

  load(url) {
    var _this = this;

    logger.debug('load', { url }), url.startsWith('?') && (url = window.location.pathname + url);


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