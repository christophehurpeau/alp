var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false, descriptor.configurable = true, "value" in descriptor && (descriptor.writable = true), Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function"); }

function _possibleConstructorReturn(self, call) { if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass); }

/* eslint class-methods-use-this: 'off' */
/* global window, document */

import Logger from 'nightingale-logger';
import { EventEmitter } from 'events';
import compose from './compose';
import context from './context';
import request from './request';
import response from './response';

var logger = new Logger('ibex');

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

    return _this.context.state = {}, _this.middleware = [], _this.context = Object.create(context), _this.context.app = _this, _this.context.state = {}, _this;
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
      this.listeners('error').length || this.on('error', this.onerror), this.callback = compose(this.middleware), url && this.load(url);
    }
  }, {
    key: 'createContext',
    value: function createContext() {
      var context = Object.create(this.context);

      return context.request = Object.create(request), context.response = Object.create(response), context.request.app = context.response.app = this, context;
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
}(EventEmitter);

export { Application as default };
//# sourceMappingURL=index.js.map