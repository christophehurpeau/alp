'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const Logger = require('nightingale-logger');
const IntlMessageFormat = require('intl-messageformat');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e['default'] : e; }

const Logger__default = /*#__PURE__*/_interopDefaultLegacy(Logger);
const IntlMessageFormat__default = /*#__PURE__*/_interopDefaultLegacy(IntlMessageFormat);

function load(translations, language) {
  const result = new Map();

  (function loadMap(map, prefix) {
    map.forEach((value, key) => {
      if (typeof value === 'object') {
        return loadMap(value, `${prefix}${key}.`);
      }

      result.set(`${prefix}${key}`, new IntlMessageFormat__default(value, language));
    });
  })(translations, '');

  return result;
}

const logger = new Logger__default('alp:translate');
function alpTranslate(dirname) {
  dirname = dirname.replace(/\/*$/, '/');
  return app => {
    const appTranslations = new Map();
    Object.assign(app.context, {
      t(id, args) {
        const msg = appTranslations.get(this.language).get(id);

        if (!msg) {
          logger.warn('invalid msg', {
            language: this.language,
            id
          });
          return id;
        }

        return msg.format(args);
      }

    });
    const config = app.config;
    config.get('availableLanguages').forEach(language => {
      const translations = app.loadConfigSync(dirname + language);
      appTranslations.set(language, load(translations, language));
    });
    return appTranslations;
  };
}

exports.default = alpTranslate;
//# sourceMappingURL=index-node12.cjs.js.map
