import IntlMessageFormat from 'intl-messageformat';

function load(translations, language) {
  var result = new Map();

  (function loadMap(map, prefix) {
    map.forEach(function (value, key) {
      if (typeof value === 'object') {
        return loadMap(value, "" + prefix + key + ".");
      }

      result.set("" + prefix + key, new IntlMessageFormat(value, language));
    });
  })(translations, '');

  return result;
}

function alpTranslate(dirname) {
  dirname = dirname.replace(/\/*$/, '/');
  return function (app) {
    var language = app.context.language; // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore

    return app.loadConfig(dirname + language).then(function (map) {
      var translations = load(map, language);
      Object.assign(app.context, {
        t: function t(key, args) {
          var msg = translations.get(key);
          if (!msg) return key;
          return msg.format(args);
        }
      });
      return map;
    });
  };
}

export default alpTranslate;
//# sourceMappingURL=index-browser.es.js.map
