import Logger from 'nightingale-logger';
import load from './load';

const logger = new Logger('alp:translate');

export default function alpTranslate(dirname) {
  return dirname = dirname.replace(/\/*$/, '/'), app => {
    Object.assign(app.context, {
      t(key, args) {
        const msg = app.translations.get(this.language).get(key);
        return msg ? msg.format(args) : (logger.warn('invalid msg', { language: this.language, key }), key);
      }
    }), app.translations = new Map(), app.config.get('availableLanguages').forEach(language => {
      const translations = app.config.loadConfigSync(dirname + language);
      app.translations.set(language, load(translations, language));
    });
  };
}
//# sourceMappingURL=index.js.map