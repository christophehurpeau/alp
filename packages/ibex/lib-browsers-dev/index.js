'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false, descriptor.configurable = true, "value" in descriptor && (descriptor.writable = true), Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor; }; }();

var _dec, _dec2, _desc, _value, _class, _descriptor, _descriptor2; /* eslint class-methods-use-this: 'off' */
/* global window, document */

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _events = require('events');

var _compose = require('./compose');

var _compose2 = _interopRequireDefault(_compose);

var _context = require('./context');

var _context2 = _interopRequireDefault(_context);

var _request = require('./request');

var _request2 = _interopRequireDefault(_request);

var _response = require('./response');

var _response2 = _interopRequireDefault(_response);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _initDefineProp(target, property, descriptor, context) {
  descriptor && Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function"); }

function _possibleConstructorReturn(self, call) { if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass); }

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

var logger = new _nightingaleLogger2.default('ibex');

function respond(ctx) {
  // allow bypassing


  // const code = ctx.status;

  if (ctx.respond !== false) {

      var body = ctx.body;
      if (body != null) {
          if (typeof body === 'string') return void (document.body.innerHTML = body);

          throw body.nodeType && (document.body.innerHTML = '', document.body.appendChild(body)), new Error('Invalid body result');
        }
    }
}

var Application = (_dec = _flowRuntime2.default.decorate(_flowRuntime2.default.array(_flowRuntime2.default.function())), _dec2 = _flowRuntime2.default.decorate(_flowRuntime2.default.object()), _class = function (_EventEmitter) {
  function Application() {
    _classCallCheck(this, Application);

    var _this = _possibleConstructorReturn(this, (Application.__proto__ || Object.getPrototypeOf(Application)).call(this));

    return _this.context.state = {}, _initDefineProp(_this, 'middleware', _descriptor, _this), _initDefineProp(_this, 'context', _descriptor2, _this), _this.middleware = [], _this.context = Object.create(_context2.default), _this.context.app = _this, _this.context.state = {}, _this;
  }

  return _inherits(Application, _EventEmitter), _createClass(Application, [{
    key: 'use',
    value: function use(fn) {
      var _fnType = _flowRuntime2.default.function();

      return _flowRuntime2.default.param('fn', _fnType).assert(fn), logger.debug('use', { name: fn.name || '-' }), this.middleware.push(fn), this;
    }
  }, {
    key: 'onerror',
    value: function onerror(e) {
      var _eType = _flowRuntime2.default.any();

      _flowRuntime2.default.param('e', _eType).assert(e), logger.error(e);
    }
  }, {
    key: 'run',
    value: function run(url) {
      var _urlType = _flowRuntime2.default.mixed();

      _flowRuntime2.default.param('url', _urlType).assert(url), this.listeners('error').length || this.on('error', this.onerror), this.callback = (0, _compose2.default)(this.middleware), url && this.load(url);
    }
  }, {
    key: 'createContext',
    value: function createContext() {
      var context = Object.create(this.context);

      return context.request = Object.create(_request2.default), context.response = Object.create(_response2.default), context.request.app = context.response.app = this, context;
    }
  }, {
    key: 'load',
    value: function load(url) {
      var _this2 = this;

      var _urlType2 = _flowRuntime2.default.string();

      _flowRuntime2.default.param('url', _urlType2).assert(url), logger.debug('load', { url: url }), url.startsWith('?') && (url = _urlType2.assert(window.location.pathname + url));


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
      var _returnType = _flowRuntime2.default.return(_flowRuntime2.default.string());

      return _returnType.assert(this.env);
    }
  }]), Application;
}(_events.EventEmitter), _descriptor = _applyDecoratedDescriptor(_class.prototype, 'middleware', [_dec], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'context', [_dec2], {
  enumerable: true,
  initializer: null
}), _class);
exports.default = Application;
//# sourceMappingURL=index.js.map