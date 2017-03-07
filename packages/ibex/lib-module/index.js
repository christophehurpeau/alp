var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var Application = function (_EventEmitter) {
  _inherits(Application, _EventEmitter);

  function Application() {
    _classCallCheck(this, Application);

    var _this = _possibleConstructorReturn(this, (Application.__proto__ || Object.getPrototypeOf(Application)).call(this));

    _this.middleware = [];
    _this.context = Object.create(context);
    _this.context.app = _this;
    _this.context.state = {};
    return _this;
  }

  _createClass(Application, [{
    key: 'use',
    value: function use(fn) {
      logger.debug('use', { name: fn.name || '-' });
      this.middleware.push(fn);
      return this;
    }
  }, {
    key: 'onerror',
    value: function onerror(e) {
      logger.error(e);
    }
  }, {
    key: 'run',
    value: function run(url) {
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

      logger.debug('load', { url: url });

      if (url.startsWith('?')) {
        url = window.location.pathname + url;
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
      return this.env;
    }
  }]);

  return Application;
}(EventEmitter);

export { Application as default };
//# sourceMappingURL=index.js.map