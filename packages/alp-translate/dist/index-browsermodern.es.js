import IntlMessageFormat from 'intl-messageformat';

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

function alpTranslate(dirname) {
  dirname = dirname.replace(/\/*$/, '/');
  return function (app) {
    Object.assign(app.context, {
      t(key, args) {
        const msg = app.translations.get(key);
        if (!msg) return key;
        return msg.format(args);
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
//# sourceMappingURL=index-browsermodern.es.js.map
