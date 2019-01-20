import Ibex from 'ibex';
import config, { existsConfig, getConfig } from 'alp-browser-config';
import language from 'alp-browser-language';
import translate from 'alp-translate/browser';
import Logger from 'nightingale-logger';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
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
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var logger = new Logger('alp');
var configPath = '/config';

var AlpBrowser =
/*#__PURE__*/
function (_Ibex) {
  _inheritsLoose(AlpBrowser, _Ibex);

  function AlpBrowser(path, _temp) {
    var _this;

    if (path === void 0) {
      path = '/';
    }

    var _ref = _temp === void 0 ? {} : _temp,
        _ref$version = _ref.version,
        version = _ref$version === void 0 ? window.__VERSION__ : _ref$version;

    _this = _Ibex.call(this) || this;
    _this.path = path;
    _this.appVersion = version;
    return _this;
  }

  var _proto = AlpBrowser.prototype;

  _proto.init =
  /*#__PURE__*/
  function () {
    var _init = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return config(this, configPath);

            case 2:
              language(this);
              _context.next = 5;
              return translate('/locales')(this);

            case 5:
              return _context.abrupt("return", this);

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function init() {
      return _init.apply(this, arguments);
    };
  }();

  _proto.existsConfig = function existsConfig$$1(name) {
    return existsConfig("/config" + name);
  };

  _proto.loadConfig = function loadConfig(name) {
    return getConfig("/config" + name);
  };

  _proto.start = function start(fn) {
    try {
      fn().then(function () {
        return logger.success('started');
      }).catch(function (err) {
        return logger.error('start fail', {
          err: err
        });
      });
    } catch (err) {
      logger.error('start fail', {
        err: err
      });
    }
  };

  return AlpBrowser;
}(Ibex);

export default AlpBrowser;
//# sourceMappingURL=index-browser-dev.es.js.map
