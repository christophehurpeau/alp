import { Logger } from 'nightingale-logger';
import IntlMessageFormatDefault from 'intl-messageformat';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const IntlMessageFormat =
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
IntlMessageFormatDefault.default || IntlMessageFormatDefault;
function load(translations, language) {
  const result = new Map();
  (function loadMap(map, prefix) {
    map.forEach((value, key) => {
      if (typeof value === 'object') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        loadMap(value, `${prefix}${key}.`);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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

export { alpTranslate as default };
//# sourceMappingURL=index-node18.mjs.map
