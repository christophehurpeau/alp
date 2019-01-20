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
    const language = app.context.language; // @ts-ignore

    return app.loadConfig(dirname + language).then(function (map) {
      const translations = load(map, language);
      Object.assign(app.context, {
        t(key, args) {
          const msg = translations.get(key);
          if (!msg) return key;
          return msg.format(args);
        }

      });
      return map;
    });
  };
}

export default alpTranslate;
//# sourceMappingURL=index-browsermodern-dev.es.js.map
