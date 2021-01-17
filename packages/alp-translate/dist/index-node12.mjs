import Logger from 'nightingale-logger';
import IntlMessageFormat from 'intl-messageformat';

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

export default alpTranslate;
//# sourceMappingURL=index-node12.mjs.map
