import Logger from 'nightingale-logger';
import load from './load';

var logger = new Logger('alp:translate');

export default function alpTranslate(dirname) {
  dirname = dirname.replace(/\/*$/, '/');
  return function (app) {
    Object.assign(app.context, {
      t: function t(key, args) {
        var msg = app.translations.get(this.language).get(key);
        if (!msg) {
          logger.warn('invalid msg', { language: this.language, key: key });
          return key;
        }

        return msg.format(args);
      }
    });

    app.translations = new Map();
    app.config.get('availableLanguages').forEach(function (language) {
      var translations = app.config.loadConfigSync(dirname + language);
      app.translations.set(language, load(translations, language));
    });
  };
}
//# sourceMappingURL=index.js.map