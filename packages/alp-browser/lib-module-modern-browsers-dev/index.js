var _dec, _dec2, _desc, _value, _class, _descriptor, _descriptor2;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['keys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['defineProperty'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper() {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

/* global window */
import Ibex from 'ibex';
import config from 'alp-config';
import errors from 'alp-errors-browser';
import params from 'alp-params';
import language from 'alp-language';
import translate from 'alp-translate';
import contentLoaded from 'content-loaded';
import { init as initWebApp, redirect } from 'alauda/web-app';
import Logger from 'nightingale-logger';

import t from 'flow-runtime';
export { Config } from 'alp-config';
export { default as newController } from 'alp-controller';

const logger = new Logger('alp');

const OptionsType = t.type('OptionsType', t.object(t.property('version', t.nullable(t.string()))));
let AlpBrowser = (_dec = t.decorate(t.string()), _dec2 = t.decorate(t.string()), (_class = class extends Ibex {

  constructor(path = '/', _arg = {}) {
    let { version = window.VERSION } = OptionsType.assert(_arg);

    super();

    _initDefineProp(this, 'path', _descriptor, this);

    _initDefineProp(this, 'appVersion', _descriptor2, this);

    this.path = path;
    this.appVersion = window.VERSION;

    if (global.initialBrowserContext) {
      this.context.state = global.initialBrowserContext.state;
    }
  }

  init() {
    var _this = this;

    return _asyncToGenerator(function* () {
      yield config('/config')(_this);
      params(_this);
      language(_this);
      yield translate('/locales')(_this);
    })();
  }

  get environment() {
    return this.env;
  }

  catchErrors() {
    this.use(errors);
  }

  initialRender(moduleDescriptor, data) {
    var _this2 = this;

    const context = Object.create(this.context);
    Object.assign(context, global.initialBrowserContext);
    delete context.state;

    return contentLoaded().then(function () {
      return context.render(moduleDescriptor, data, true);
    }).then(function () {
      _this2.on('redirect', redirect);
      initWebApp(function (url) {
        return _this2.load(url);
      });
    });
  }

  start(fn) {
    let _fnType = t.function();

    t.param('fn', _fnType).assert(fn);

    fn().then(function () {
      return logger.success('started');
    }).catch(function (err) {
      return logger.error('start fail', { err });
    });
  }
}, (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'path', [_dec], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'appVersion', [_dec2], {
  enumerable: true,
  initializer: null
})), _class));
export { AlpBrowser as default };
//# sourceMappingURL=index.js.map