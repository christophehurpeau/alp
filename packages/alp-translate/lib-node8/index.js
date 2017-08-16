'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = alpTranslate;

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _load = require('./load');

var _load2 = _interopRequireDefault(_load);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('alp:translate');

function alpTranslate(dirname) {
  return dirname = dirname.replace(/\/*$/, '/'), app => {
    Object.assign(app.context, {
      t(key, args) {
        const msg = app.translations.get(this.language).get(key);
        return msg ? msg.format(args) : (logger.warn('invalid msg', { language: this.language, key }), key);
      }
    }), app.translations = new Map(), app.config.get('availableLanguages').forEach(language => {
      const translations = app.config.loadConfigSync(dirname + language);
      app.translations.set(language, (0, _load2.default)(translations, language));
    });
  };
}
//# sourceMappingURL=index.js.map