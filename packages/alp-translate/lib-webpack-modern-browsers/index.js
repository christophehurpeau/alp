import Logger from 'nightingale-logger';
import load from './load';

var logger = new Logger('alp:translate');

export default function alpTranslate(dirname) {
  dirname = dirname.replace(/\/*$/, '/');
  return app => {
    Object.assign(app.context, {
      t(key, args) {
        var msg = app.translations.get(this.language).get(key);
        if (!msg) {
          logger.warn('invalid msg', { language: this.language, key });
          return key;
        }

        return msg.format(args);
      }
    });

    app.translations = new Map();
    app.config.get('availableLanguages').forEach(language => {
      var translations = app.config.loadConfigSync(dirname + language);
      app.translations.set(language, load(translations, language));
    });
  };
}
//# sourceMappingURL=index.js.map