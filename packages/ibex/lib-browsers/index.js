'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false, descriptor.configurable = true, "value" in descriptor && (descriptor.writable = true), Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor; }; }();

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function"); }

function _possibleConstructorReturn(self, call) { if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass); } /* eslint class-methods-use-this: 'off' */
/* global window, document */

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

var Application = function (_EventEmitter) {
  function Application() {
    _classCallCheck(this, Application);

    var _this = _possibleConstructorReturn(this, (Application.__proto__ || Object.getPrototypeOf(Application)).call(this));

    return _this.context.state = {}, _this.middleware = [], _this.context = Object.create(_context2.default), _this.context.app = _this, _this.context.state = {}, _this;
  }

  return _inherits(Application, _EventEmitter), _createClass(Application, [{
    key: 'use',
    value: function use(fn) {
      return logger.debug('use', { name: fn.name || '-' }), this.middleware.push(fn), this;
    }
  }, {
    key: 'onerror',
    value: function onerror(e) {
      logger.error(e);
    }
  }, {
    key: 'run',
    value: function run(url) {
      this.listeners('error').length || this.on('error', this.onerror), this.callback = (0, _compose2.default)(this.middleware), url && this.load(url);
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

      logger.debug('load', { url: url }), url.startsWith('?') && (url = window.location.pathname + url);


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
      return this.env;
    }
  }]), Application;
}(_events.EventEmitter);

exports.default = Application;
//# sourceMappingURL=index.js.map