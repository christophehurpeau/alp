'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var t = _interopDefault(require('flow-runtime'));
var delegate = _interopDefault(require('delegates'));
var querystring = require('querystring');
var events = require('events');
var Logger = _interopDefault(require('nightingale-logger'));

// create lib
function compose(middlewares) {
  var _middlewaresType = t.array(t.function());

  t.param('middlewares', _middlewaresType).assert(middlewares);

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
          if (called) throw new Error('Cannot call next() more than once.');
          called = true;
          return dispatch(i + 1);
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    }(0);
  };
}

var proto = {};

delegate(proto, 'response').access('body').method('redirect');

delegate(proto, 'request').getter('host').getter('hostname').getter('href').getter('origin').getter('path').getter('protocol').getter('query').getter('url').getter('search').getter('searchParams');

var request = {
  get search() {
    return window.location.search;
  },
  get path() {
    return window.location.pathname;
  },
  get port() {
    return window.location.port;
  },
  get url() {
    return window.location.url;
  },
  get origin() {
    return window.location.origin;
  },
  get protocol() {
    return window.location.protocol;
  },
  get query() {
    return querystring.parse(window.location.search);
  },
  get searchParams() {
    return new URLSearchParams(window.location.search.length === 0 ? window.location.search : window.location.search.substr(1));
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

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var _dec, _dec2, _class, _descriptor, _descriptor2;

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

var Application = (_dec = t.decorate(t.array(t.function())), _dec2 = t.decorate(t.object()), _class = function (_EventEmitter) {
  inherits(Application, _EventEmitter);

  function Application() {
    classCallCheck(this, Application);

    var _this = possibleConstructorReturn(this, (Application.__proto__ || Object.getPrototypeOf(Application)).call(this));

    _initDefineProp(_this, 'middleware', _descriptor, _this);

    _initDefineProp(_this, 'context', _descriptor2, _this);

    _this.context.app = _this;
    _this.context.state = {};
    return _this;
  }

  createClass(Application, [{
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
    get: function get$$1() {
      var _returnType = t.return(t.string());

      return _returnType.assert(this.env);
    }
  }]);
  return Application;
}(events.EventEmitter), _descriptor = _applyDecoratedDescriptor(_class.prototype, 'middleware', [_dec], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'context', [_dec2], {
  enumerable: true,
  initializer: function initializer() {
    return Object.create(proto);
  }
}), _class);

module.exports = Application;
//# sourceMappingURL=index-browser-dev.cjs.js.map
