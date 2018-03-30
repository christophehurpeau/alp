import Ibex from 'ibex';
import config from 'alp-config';
import language from 'alp-language';
import translate from 'alp-translate';
import Logger from 'nightingale-logger';

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
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

var logger = new Logger('alp');

var AlpBrowser = function (_Ibex) {
  inherits(AlpBrowser, _Ibex);

  function AlpBrowser() {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';

    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$version = _ref.version,
        version = _ref$version === undefined ? window.VERSION : _ref$version;

    classCallCheck(this, AlpBrowser);

    var _this = possibleConstructorReturn(this, (AlpBrowser.__proto__ || Object.getPrototypeOf(AlpBrowser)).call(this));

    _this.path = path;
    _this.appVersion = window.VERSION;
    return _this;
  }

  createClass(AlpBrowser, [{
    key: 'init',
    value: function () {
      var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return config('/config')(this);

              case 2:
                language(this);
                _context.next = 5;
                return translate('/locales')(this);

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function init() {
        return _ref2.apply(this, arguments);
      };
    }()
  }, {
    key: 'start',
    value: function start(fn) {
      fn().then(function () {
        return logger.success('started');
      }).catch(function (err) {
        return logger.error('start fail', { err: err });
      });
    }
  }, {
    key: 'environment',
    get: function get$$1() {
      return this.env;
    }
  }]);
  return AlpBrowser;
}(Ibex);

export default AlpBrowser;
//# sourceMappingURL=index-browser.es.js.map
