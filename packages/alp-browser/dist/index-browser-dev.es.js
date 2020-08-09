import _regeneratorRuntime from '@babel/runtime/regenerator';
import _asyncToGenerator from '@babel/runtime/helpers/esm/asyncToGenerator';
import _inheritsLoose from '@babel/runtime/helpers/esm/inheritsLoose';
import Ibex from 'ibex';
import config, { existsConfig, getConfig } from 'alp-browser-config';
import language from 'alp-browser-language';
import translate from 'alp-translate/browser';
import Logger from 'nightingale-logger';

var logger = new Logger('alp');
var configPath = '/config';

var AlpBrowser = /*#__PURE__*/function (_Ibex) {
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

  _proto.init = /*#__PURE__*/function () {
    var _init = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      return _regeneratorRuntime.wrap(function _callee$(_context) {
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

  _proto.existsConfig = function existsConfig$1(name) {
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
var startApp = function startApp(callback) {
  var app = new AlpBrowser();
  return app.start( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
    var browserApp;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return app.init();

          case 2:
            browserApp = _context2.sent;
            _context2.next = 5;
            return callback(browserApp);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
};

export default AlpBrowser;
export { startApp };
//# sourceMappingURL=index-browser-dev.es.js.map
