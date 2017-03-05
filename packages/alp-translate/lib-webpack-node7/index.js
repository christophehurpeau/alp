import Logger from 'nightingale-logger';
import load from './load';

const logger = new Logger('alp:translate');

export default function alpTranslate(dirname) {
  dirname = dirname.replace(/\/*$/, '/');
  return app => {
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
    app.config.get('availableLanguages').forEach(language => {
      const translations = app.config.loadConfigSync(dirname + language);
      app.translations.set(language, load(translations, language));
    });
  };
}
//# sourceMappingURL=index.js.map