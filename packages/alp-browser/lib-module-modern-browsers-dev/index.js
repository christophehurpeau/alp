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

/* global window */
import Ibex from 'ibex';
import config from 'alp-config';
import language from 'alp-language';
import translate from 'alp-translate';
import Logger from 'nightingale-logger';

import t from 'flow-runtime';
export { Config } from 'alp-config';

const logger = new Logger('alp');

const OptionsType = t.type('OptionsType', t.object(t.property('version', t.nullable(t.string()))));
let AlpBrowser = (_dec = t.decorate(t.string()), _dec2 = t.decorate(t.string()), _class = class extends Ibex {

  constructor(path = '/', _arg = {}) {
    let { version = window.VERSION } = OptionsType.assert(_arg);
    super(), _initDefineProp(this, 'path', _descriptor, this), _initDefineProp(this, 'appVersion', _descriptor2, this), this.path = path, this.appVersion = window.VERSION;
  }

  async init() {
    await config('/config')(this), language(this), await translate('/locales')(this);
  }

  get environment() {
    return this.env;
  }

  start(fn) {
    let _fnType = t.function();

    t.param('fn', _fnType).assert(fn), fn().then(function () {
      return logger.success('started');
    }).catch(function (err) {
      return logger.error('start fail', { err });
    });
  }
}, _descriptor = _applyDecoratedDescriptor(_class.prototype, 'path', [_dec], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'appVersion', [_dec2], {
  enumerable: true,
  initializer: null
}), _class);
export { AlpBrowser as default };
//# sourceMappingURL=index.js.map