'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _assertThisInitialized = require('@babel/runtime/helpers/esm/assertThisInitialized');
var _inheritsLoose = require('@babel/runtime/helpers/esm/inheritsLoose');
var events = require('events');
var Logger = require('nightingale-logger');
var querystring = require('querystring');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e['default'] : e; }

var _assertThisInitialized__default = /*#__PURE__*/_interopDefaultLegacy(_assertThisInitialized);
var _inheritsLoose__default = /*#__PURE__*/_interopDefaultLegacy(_inheritsLoose);
var Logger__default = /*#__PURE__*/_interopDefaultLegacy(Logger);

// TODO create lib
function compose(middlewares) {
  return function (ctx) {
    var index = -1;
    return function dispatch(i) {
      if (i <= index) {
        return Promise.reject(new Error('next() called multiple times'));
      }

      index = i;
      var fn = middlewares[i];
      var called = false;

      try {
        return Promise.resolve(fn.call(ctx, ctx, function () {
          if (called) {
            throw new Error('Cannot call next() more than once.');
          }

          called = true;
          return dispatch(i + 1);
        }));
      } catch (err) {
        return Promise.reject(err);
      }
    }(0);
  };
}

var proto = {};

var defineGetter = function defineGetter(target, name) {
  Object.defineProperty(proto, name, {
    get: function get() {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      return this[target][name];
    }
  });
};

var defineAccess = function defineAccess(target, name) {
  Object.defineProperty(proto, name, {
    get: function get() {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      return this[target][name];
    },
    set: function set(value) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,  @typescript-eslint/no-unsafe-member-access
      this[target][name] = value; // eslint-disable-next-line @typescript-eslint/no-unsafe-return

      return value;
    }
  });
};

var defineMethod = function defineMethod(target, name) {
  Object.defineProperty(proto, name, {
    value: function value() {
      var _this$target$name, _len, args, _key;

      for (_len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      return (_this$target$name = this[target][name]).call.apply(_this$target$name, [this[target]].concat(args));
    }
  });
};

defineAccess('response', 'body');
defineMethod('response', 'redirect');
defineGetter('request', 'host');
defineGetter('request', 'hostname');
defineGetter('request', 'href');
defineGetter('request', 'origin');
defineGetter('request', 'path');
defineGetter('request', 'protocol');
defineGetter('request', 'query');
defineGetter('request', 'url');
defineGetter('request', 'search');
defineGetter('request', 'searchParams');

var request = {
  get search() {
    return window.location.search;
  },

  get path() {
    return window.location.pathname;
  },

  get url() {
    return window.location.pathname + window.location.search;
  },

  get origin() {
    return window.location.origin;
  },

  get protocol() {
    return window.location.protocol;
  },

  get query() {
    return window.location.search.length === 0 ? {} : querystring.parse(window.location.search.slice(1));
  },

  get querystring() {
    return window.location.search;
  },

  get searchParams() {
    return new URLSearchParams(window.location.search.length === 0 ? window.location.search : window.location.search.slice(1));
  },

  get href() {
    return window.location.href;
  },

  get host() {
    return window.location.host;
  },

  get hostname() {
    return window.location.hostname;
  },

  get headers() {
    throw new Error('Headers not available in ibex request.');
  },

  get accepts() {
    throw new Error('Not implemented.');
  },

  get acceptsLanguages() {
    throw new Error('Not implemented.');
  }

};

var response = {
  redirect: function redirect(url) {
    if (this.app.emit('redirect', url) === false) {
      window.location.href = url;
      return new Promise(function () {// promise that never resolves.
      });
    }

    return Promise.resolve();
  }
};

var logger = new Logger__default('ibex');

function respond(ctx) {
  // allow bypassing
  if (ctx.respond === false) {
    return;
  }

  var body = ctx.body;
  if (body == null) return; // const code = ctx.status;

  if (typeof body === 'string') {
    document.body.innerHTML = body;
    return;
  }

  if (body.nodeType) {
    document.body.innerHTML = '';
    document.body.append(body);
  }

  throw new Error('Invalid body result');
}

var Application = /*#__PURE__*/function (_EventEmitter) {
  _inheritsLoose__default(Application, _EventEmitter);

  function Application() {
    var _this = _EventEmitter.call(this) || this;

    _this.middleware = [];
    _this.context = Object.create(proto);
    _this.context.app = _assertThisInitialized__default(_this);
    return _this;
  }

  var _proto = Application.prototype;

  _proto.use = function use(fn) {
    logger.debug('use', {
      name: fn.name || '-'
    });
    this.middleware.push(fn);
    return this;
  };

  _proto.onerror = function onerror(e) {
    logger.error(e);
  };

  _proto.run = function run(url) {
    if (this.listeners('error').length === 0) {
      this.on('error', this.onerror);
    }

    this.callback = compose(this.middleware);

    if (url) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.load(url);
    }
  };

  _proto.createContext = function createContext() {
    var context = Object.create(this.context);
    context.request = Object.create(request);
    context.response = Object.create(response);
    Object.assign(context.request, {
      app: this
    });
    Object.assign(context.response, {
      app: this
    });
    context.state = {};
    context.sanitizedState = {};
    return context;
  };

  _proto.load = function load(url) {
    var _this2 = this;

    logger.debug('load', {
      url: url
    });

    if (url.startsWith('?')) {
      url = window.location.pathname + url;
    }

    if (!this.callback) {
      throw new Error('You should call load() after run()');
    }

    var context = this.createContext();
    return this.callback(context).then(function () {
      return respond(context);
    }).catch(function (err) {
      _this2.emit('error', err);
    });
  };

  return Application;
}(events.EventEmitter);

exports.default = Application;
//# sourceMappingURL=index-browser-dev.cjs.js.map
