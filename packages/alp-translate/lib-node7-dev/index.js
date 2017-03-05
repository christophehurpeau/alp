'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = alpTranslate;

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _load = require('./load');

var _load2 = _interopRequireDefault(_load);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('alp:translate');

function alpTranslate(dirname) {
  let _dirnameType = _flowRuntime2.default.string();

  _flowRuntime2.default.param('dirname', _dirnameType).assert(dirname);

  dirname = _dirnameType.assert(dirname.replace(/\/*$/, '/'));
  return app => {
    Object.assign(app.context, {
      t(key, args) {
        let _keyType = _flowRuntime2.default.string();

        let _argsType = _flowRuntime2.default.nullable(_flowRuntime2.default.object());

        const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.string());

        _flowRuntime2.default.param('key', _keyType).assert(key);

        _flowRuntime2.default.param('args', _argsType).assert(args);

        const msg = app.translations.get(this.language).get(key);
        if (!msg) {
          logger.warn('invalid msg', { language: this.language, key });
          return _returnType.assert(key);
        }

        return _returnType.assert(msg.format(args));
      }
    });

    app.translations = new Map();
    app.config.get('availableLanguages').forEach(language => {
      const translations = app.config.loadConfigSync(dirname + language);
      app.translations.set(language, (0, _load2.default)(translations, language));
    });
  };
}
//# sourceMappingURL=index.js.map