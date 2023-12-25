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

export { alpTranslate as default };
//# sourceMappingURL=index-browser.es.js.map
