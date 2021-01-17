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

function alpTranslate(dirname) {
  dirname = dirname.replace(/\/*$/, '/');
  return async app => {
    const language = app.context.language;
    const map = await app.loadConfig(dirname + language);
    const translations = load(map, language);
    Object.assign(app.context, {
      t(key, args) {
        const msg = translations.get(key);
        if (!msg) return key;
        return msg.format(args);
      }

    });
  };
}

export default alpTranslate;
//# sourceMappingURL=index-browsermodern-dev.es.js.map
