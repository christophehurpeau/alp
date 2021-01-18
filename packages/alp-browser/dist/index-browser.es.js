import _regeneratorRuntime from '@babel/runtime/regenerator';
import _asyncToGenerator from '@babel/runtime/helpers/esm/asyncToGenerator';
import config, { existsConfig, getConfig } from 'alp-browser-config';
import language from 'alp-browser-language';
import translate from 'alp-translate/browser';
import Ibex from 'ibex';
import Logger from 'nightingale-logger';

const logger = new Logger('alp');
const configPath = '/config';
class AlpBrowser extends Ibex {
  constructor(path = '/', {
    version = window.__VERSION__
  } = {}) {
    super();
    this.path = path;
    this.appVersion = version;
  }

  init() {
    var _this = this;

    return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var configInstance;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return config(_this, `/${_this.appVersion}${configPath}`);

          case 2:
            configInstance = _context.sent;
            _this.context.config = configInstance;
            language(_this);
            _context.next = 7;
            return translate('/locales')(_this);

          case 7:
            return _context.abrupt("return", _this);

          case 8:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }))();
  }

  existsConfig(name) {
    return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", existsConfig(`${configPath}${name}`));

          case 1:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }))();
  }

  loadConfig(name) {
    return getConfig(`${configPath}${name}`);
  }

  start(fn) {
    try {
      fn().then(() => logger.success('started')).catch(err => logger.error('start fail', {
        err
      }));
    } catch (err) {
      logger.error('start fail', {
        err
      });
    }
  }

}
const startApp = callback => {
  const app = new AlpBrowser();
  return app.start( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
    var browserApp;
    return _regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
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
    }, _callee3);
  })));
};

export default AlpBrowser;
export { startApp };
//# sourceMappingURL=index-browser.es.js.map
