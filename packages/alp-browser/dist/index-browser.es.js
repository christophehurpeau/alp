import _regeneratorRuntime from '@babel/runtime/regenerator';
import _inheritsLoose from '@babel/runtime/helpers/esm/inheritsLoose';
import Ibex from 'ibex';
import config, { existsConfig, getConfig } from 'alp-browser-config';
import language from 'alp-browser-language';
import translate from 'alp-translate/browser';
import Logger from 'nightingale-logger';

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

  _proto.init = function init() {
    return _regeneratorRuntime.async(function init$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _regeneratorRuntime.awrap(config(this, "/" + this.appVersion + configPath));

          case 2:
            language(this);
            _context.next = 5;
            return _regeneratorRuntime.awrap(translate('/locales')(this));

          case 5:
            return _context.abrupt("return", this);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, null, this);
  };

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

export default AlpBrowser;
//# sourceMappingURL=index-browser.es.js.map
