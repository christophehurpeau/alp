import IntlMessageFormat from 'intl-messageformat';
import t from 'flow-runtime';

function load(translations, language) {
  let _translationsType = t.ref('Map', t.string(), t.any());

  let _languageType = t.string();

  const _returnType = t.return(t.ref('Map', t.string(), t.ref(IntlMessageFormat)));

  t.param('translations', _translationsType).assert(translations);
  t.param('language', _languageType).assert(language);

  const result = new Map();

  (function loadMap(map, prefix) {
    map.forEach(function (value, key) {
      if (typeof value === 'object') {
        return loadMap(value, `${prefix}${key}.`);
      }

      result.set(`${prefix}${key}`, new IntlMessageFormat(value, language));
    });
  })(translations, '');

  return _returnType.assert(result);
}

function alpTranslate(dirname) {
  let _dirnameType = t.string();

  t.param('dirname', _dirnameType).assert(dirname);

  dirname = _dirnameType.assert(dirname.replace(/\/*$/, '/'));
  return function (app) {
    Object.assign(app.context, {
      t(key, args) {
        let _keyType = t.string();

        let _argsType = t.nullable(t.object());

        const _returnType = t.return(t.string());

        t.param('key', _keyType).assert(key);

        t.param('args', _argsType).assert(args);

        const msg = app.translations.get(key);
        if (!msg) return _returnType.assert(key);
        return _returnType.assert(msg.format(args));
      }
    });

    const language = app.context.language;
    return app.loadConfig(dirname + language).then(function (map) {
      app.translations = load(map, language);
      return map;
    });
  };
}

export default alpTranslate;
//# sourceMappingURL=index-browsermodern-dev.es.js.map
