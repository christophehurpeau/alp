var _dec, _dec2, _desc, _value, _class, _descriptor, _descriptor2;

function _initDefineProp(target, property, descriptor, context) {
  descriptor && Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  return Object['keys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  }), desc.enumerable = !!desc.enumerable, desc.configurable = !!desc.configurable, ('value' in desc || desc.initializer) && (desc.writable = true), desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc), context && desc.initializer !== void 0 && (desc.value = desc.initializer ? desc.initializer.call(context) : void 0, desc.initializer = void 0), desc.initializer === void 0 && (Object['defineProperty'](target, property, desc), desc = null), desc;
}

function _initializerWarningHelper() {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

/* eslint class-methods-use-this: 'off' */
/* global window, document */

import Logger from 'nightingale-logger';
import { EventEmitter } from 'events';
import compose from './compose';
import context from './context';
import request from './request';
import response from './response';

import t from 'flow-runtime';
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

let Application = (_dec = t.decorate(t.array(t.function())), _dec2 = t.decorate(t.object()), _class = class extends EventEmitter {

  constructor() {
    super(), _initDefineProp(this, 'middleware', _descriptor, this), _initDefineProp(this, 'context', _descriptor2, this), this.middleware = [], this.context = Object.create(context), this.context.app = this, this.context.state = {};
  }

  get environment() {
    const _returnType = t.return(t.string());

    return _returnType.assert(this.env);
  }

  use(fn) {
    let _fnType = t.function();

    return t.param('fn', _fnType).assert(fn), logger.debug('use', { name: fn.name || '-' }), this.middleware.push(fn), this;
  }

  onerror(e) {
    let _eType = t.any();

    t.param('e', _eType).assert(e), logger.error(e);
  }

  run(url) {
    let _urlType = t.mixed();

    t.param('url', _urlType).assert(url), this.listeners('error').length || this.on('error', this.onerror), this.callback = compose(this.middleware), url && this.load(url);
  }

  createContext() {
    const context = Object.create(this.context);

    return context.request = Object.create(request), context.response = Object.create(response), context.request.app = context.response.app = this, context;
  }

  load(url) {
    var _this = this;

    let _urlType2 = t.string();

    t.param('url', _urlType2).assert(url), logger.debug('load', { url }), url.startsWith('?') && (url = _urlType2.assert(window.location.pathname + url));


    const context = this.createContext();
    return this.callback(context).then(function () {
      return respond(context);
    }).catch(function (err) {
      return _this.emit('error', err);
    });
  }
}, _descriptor = _applyDecoratedDescriptor(_class.prototype, 'middleware', [_dec], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'context', [_dec2], {
  enumerable: true,
  initializer: null
}), _class);
export { Application as default };
//# sourceMappingURL=index.js.map