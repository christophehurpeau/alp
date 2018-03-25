import IntlMessageFormat from 'intl-messageformat';
import _t from 'flow-runtime';
import Logger from 'nightingale-logger';

function load(translations, language) {
  let _translationsType = _t.ref('Map', _t.string(), _t.any());

  let _languageType = _t.string();

  _t.param('translations', _translationsType).assert(translations);
  _t.param('language', _languageType).assert(language);

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
  let _dirnameType = _t.string();

  _t.param('dirname', _dirnameType).assert(dirname);

  dirname = _dirnameType.assert(dirname.replace(/\/*$/, '/'));
  return app => {
    Object.assign(app.context, {
      t(key, args) {
        let _keyType = _t.string();

        let _argsType = _t.nullable(_t.object());

        const _returnType = _t.return(_t.string());

        _t.param('key', _keyType).assert(key);

        _t.param('args', _argsType).assert(args);

        const msg = app.translations.get(this.language).get(key);
        if (!msg) {
          logger.warn('invalid msg', { language: this.language, key });
          return _returnType.assert(key);
        }

        return _returnType.assert(msg.format(args));
      }
    });

    app.translations = new Map();
    app.config.get('availableLanguages').forEach(language => {
      const translations = app.config.loadConfigSync(dirname + language);
      app.translations.set(language, load(translations, language));
    });
  };
}

export default alpTranslate;
//# sourceMappingURL=index-node8-dev.es.js.map
