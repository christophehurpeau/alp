var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _desc, _value, _class, _descriptor, _descriptor2;

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

/* eslint class-methods-use-this: 'off' */
/* global window, document */

import Logger from 'nightingale-logger';
import { EventEmitter } from 'events';
import compose from './compose';
import context from './context';
import request from './request';
import response from './response';

import t from 'flow-runtime';
var logger = new Logger('ibex');

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

var Application = (_dec = t.decorate(t.array(t.function())), _dec2 = t.decorate(t.object()), (_class = function (_EventEmitter) {
  _inherits(Application, _EventEmitter);

  function Application() {
    _classCallCheck(this, Application);

    var _this = _possibleConstructorReturn(this, (Application.__proto__ || Object.getPrototypeOf(Application)).call(this));

    _initDefineProp(_this, 'middleware', _descriptor, _this);

    _initDefineProp(_this, 'context', _descriptor2, _this);

    _this.middleware = [];
    _this.context = Object.create(context);
    _this.context.app = _this;
    _this.context.state = {};
    return _this;
  }

  _createClass(Application, [{
    key: 'use',
    value: function use(fn) {
      var _fnType = t.function();

      t.param('fn', _fnType).assert(fn);

      logger.debug('use', { name: fn.name || '-' });
      this.middleware.push(fn);
      return this;
    }
  }, {
    key: 'onerror',
    value: function onerror(e) {
      var _eType = t.any();

      t.param('e', _eType).assert(e);

      logger.error(e);
    }
  }, {
    key: 'run',
    value: function run(url) {
      var _urlType = t.mixed();

      t.param('url', _urlType).assert(url);

      if (!this.listeners('error').length) {
        this.on('error', this.onerror);
      }

      this.callback = compose(this.middleware);

      if (url) {
        this.load(url);
      }
    }
  }, {
    key: 'createContext',
    value: function createContext() {
      var context = Object.create(this.context);
      context.request = Object.create(request);
      context.response = Object.create(response);
      // eslint-disable-next-line no-multi-assign
      context.request.app = context.response.app = this;
      return context;
    }
  }, {
    key: 'load',
    value: function load(url) {
      var _this2 = this;

      var _urlType2 = t.string();

      t.param('url', _urlType2).assert(url);

      logger.debug('load', { url: url });

      if (url.startsWith('?')) {
        url = _urlType2.assert(window.location.pathname + url);
      }

      var context = this.createContext();
      return this.callback(context).then(function () {
        return respond(context);
      }).catch(function (err) {
        return _this2.emit('error', err);
      });
    }
  }, {
    key: 'environment',
    get: function get() {
      var _returnType = t.return(t.string());

      return _returnType.assert(this.env);
    }
  }]);

  return Application;
}(EventEmitter), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'middleware', [_dec], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'context', [_dec2], {
  enumerable: true,
  initializer: null
})), _class));
export { Application as default };
//# sourceMappingURL=index.js.map