import _t from 'tcomb-forked';
/* eslint class-methods-use-this: 'off' */
/* global window, document */

import Logger from 'nightingale-logger';
import { EventEmitter } from 'events';
import compose from './compose';
import context from './context';
import request from './request';
import response from './response';

var logger = new Logger('ibex');

export default class Application extends EventEmitter {

  constructor() {
    super();
    this.middleware = [];
    this.context = Object.create(context);
    this.context.app = this;
    this.context.state = {};
  }

  get environment() {
    return _assert(function () {
      return this.env;
    }.apply(this, arguments), _t.String, 'return value');
  }

  use(fn) {
    _assert(fn, _t.Function, 'fn');

    logger.debug('use', { name: fn.name || '-' });
    this.middleware.push(fn);
    return this;
  }

  onerror(e) {
    _assert(e, _t.Any, 'e');

    logger.error(e);
  }

  run(url) {
    _assert(url, _t.Any, 'url');

    if (!this.listeners('error').length) {
      this.on('error', this.onerror);
    }

    this.callback = compose(this.middleware);

    if (url) {
      this.load(url);
    }
  }

  createContext() {
    var context = Object.create(this.context);
    context.request = Object.create(request);
    context.response = Object.create(response);
    context.request.app = context.response.app = this;
    return context;
  }

  load(url) {
    _assert(url, _t.String, 'url');

    logger.debug('load', { url });

    if (url.startsWith('?')) {
      url = window.location.pathname + url;
    }

    var context = this.createContext();
    return this.callback(context).then(() => respond(context)).catch(err => this.emit('error', err));
  }
}

function respond(ctx) {
  // allow bypassing
  if (ctx.respond === false) {
    return;
  }

  var body = ctx.body;
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

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _t.stringify(x) + ' supplied to ' + name + ' (expected a ' + _t.getTypeName(type) + ')';
  }

  if (_t.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _t.getTypeName(type)]);

      _t.fail(message());
    }
  } else if (!(x instanceof type)) {
    _t.fail(message());
  }

  return x;
}
//# sourceMappingURL=index.js.map