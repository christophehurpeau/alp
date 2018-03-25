import IntlMessageFormat from 'intl-messageformat';
import Logger from 'nightingale-logger';

function load(translations, language) {
  const result = new Map();

  (function loadMap(map, prefix) {
    map.forEach(function (value, key) {
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
  return function (app) {
    Object.assign(app.context, {
      t(key, args) {
        const msg = app.translations.get(this.language).get(key);
        if (!msg) {
          logger.warn('invalid msg', { language: this.language, key });
          return key;
        }

        return msg.format(args);
      }
    });

    app.translations = new Map();
    app.config.get('availableLanguages').forEach(function (language) {
      const translations = app.config.loadConfigSync(dirname + language);
      app.translations.set(language, load(translations, language));
    });
  };
}

export default alpTranslate;
//# sourceMappingURL=index-browsermodern.es.js.map
