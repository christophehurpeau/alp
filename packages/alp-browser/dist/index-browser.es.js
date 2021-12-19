import _asyncToGenerator from '@babel/runtime/helpers/esm/asyncToGenerator';
import _inheritsLoose from '@babel/runtime/helpers/esm/inheritsLoose';
import _regeneratorRuntime from '@babel/runtime/regenerator';
import config, { existsConfig, getConfig } from 'alp-browser-config';
import language from 'alp-browser-language';
import translate from 'alp-translate/browser';
import Ibex from 'ibex';
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
      var configInstance;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return config(this, !(process.env.NODE_ENV !== "production") ? "/" + this.appVersion + configPath : configPath);

            case 2:
              configInstance = _context.sent;
              this.context.config = configInstance;
              language(this);
              _context.next = 7;
              return translate('/locales')(this);

            case 7:
              return _context.abrupt("return", this);

            case 8:
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

  _proto.existsConfig = /*#__PURE__*/function () {
    var _existsConfig2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(name) {
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", existsConfig("/config" + name));

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function existsConfig() {
      return _existsConfig2.apply(this, arguments);
    };
  }();

  _proto.loadConfig = function loadConfig(name) {
    return getConfig("/config" + name);
  };

  _proto.start = function start(fn) {
    try {
      fn().then(function () {
        logger.success('started');
      }).catch(function (err) {
        logger.error('start fail', {
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
  app.start( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
    var browserApp;
    return _regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return app.init();

          case 2:
            browserApp = _context3.sent;
            _context3.next = 5;
            return callback(browserApp);

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  })));
};

export { AlpBrowser as default, startApp };
//# sourceMappingURL=index-browser.es.js.map
