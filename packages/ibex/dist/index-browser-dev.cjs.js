'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _createClass = _interopDefault(require('@babel/runtime/helpers/esm/createClass'));
var _assertThisInitialized = _interopDefault(require('@babel/runtime/helpers/esm/assertThisInitialized'));
var _inheritsLoose = _interopDefault(require('@babel/runtime/helpers/esm/inheritsLoose'));
var events = require('events');
var Logger = _interopDefault(require('nightingale-logger'));
var querystring = require('querystring');

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
      return this[target][name];
    }
  });
};

var defineAccess = function defineAccess(target, name) {
  Object.defineProperty(proto, name, {
    get: function get() {
      return this[target][name];
    },
    set: function set(value) {
      this[target][name] = value;
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
  }

};

var response = {
  redirect: function redirect(url) {
    if (this.app.emit('redirect', url) === false) {
      window.location.href = url;
    }
  }
};

var logger = new Logger('ibex');

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
  _inheritsLoose(Application, _EventEmitter);

  function Application() {
    var _this = _EventEmitter.call(this) || this;

    _this.middleware = [];
    _this.context = Object.create(proto);
    _this.context.app = _assertThisInitialized(_this);
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
      this.load(url);
    }
  };

  _proto.createContext = function createContext() {
    var context = Object.create(this.context);
    context.request = Object.create(request);
    context.response = Object.create(response); // eslint-disable-next-line no-multi-assign

    context.request.app = context.response.app = this;
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
      return _this2.emit('error', err);
    });
  };

  _createClass(Application, [{
    key: "environment",
    get: function get() {
      throw new Error('use process.env or POB_ENV instead');
    }
  }]);

  return Application;
}(events.EventEmitter);

exports.default = Application;
//# sourceMappingURL=index-browser-dev.cjs.js.map
