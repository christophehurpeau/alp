'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const Logger = _interopDefault(require('nightingale-logger'));
const IntlMessageFormat = _interopDefault(require('intl-messageformat'));

function load(translations, language) {
  const result = new Map();

  (function loadMap(map, prefix) {
    map.forEach((value, key) => {
      if (typeof value === 'object') {
        return loadMap(value, `${prefix}${key}.`);
      }

      result.set(`${prefix}${key}`, new IntlMessageFormat(value, language));
    });
  })(translations, '');

  return result;
}

const logger = new Logger('alp:translate');
function alpTranslate(dirname) {
  dirname = dirname.replace(/\/*$/, '/');
  return app => {
    const appTranslations = new Map();
    Object.assign(app.context, {
      t(id, args) {
        // @ts-ignore
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

    }); // @ts-ignore

    app.config.get('availableLanguages').forEach(language => {
      // @ts-ignore
      const translations = app.config.loadConfigSync(dirname + language);
      appTranslations.set(language, load(translations, language));
    });
    return appTranslations;
  };
}

exports.default = alpTranslate;
//# sourceMappingURL=index-node8.cjs.js.map
