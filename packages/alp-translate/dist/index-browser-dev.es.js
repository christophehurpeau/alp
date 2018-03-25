import IntlMessageFormat from 'intl-messageformat';
import t from 'flow-runtime';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

function load(translations, language) {
  var _translationsType = t.ref('Map', t.string(), t.any());

  var _languageType = t.string();

  var _returnType = t.return(t.ref('Map', t.string(), t.ref(IntlMessageFormat)));

  t.param('translations', _translationsType).assert(translations);
  t.param('language', _languageType).assert(language);

  var result = new Map();

  (function loadMap(map, prefix) {
    map.forEach(function (value, key) {
      if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
        return loadMap(value, '' + prefix + key + '.');
      }

      result.set('' + prefix + key, new IntlMessageFormat(value, language));
    });
  })(translations, '');

  return _returnType.assert(result);
}

function alpTranslate(dirname) {
  var _dirnameType = t.string();

  t.param('dirname', _dirnameType).assert(dirname);

  dirname = _dirnameType.assert(dirname.replace(/\/*$/, '/'));
  return function (app) {
    Object.assign(app.context, {
      t: function t$$1(key, args) {
        var _keyType = t.string();

        var _argsType = t.nullable(t.object());

        var _returnType = t.return(t.string());

        t.param('key', _keyType).assert(key);

        t.param('args', _argsType).assert(args);

        var msg = app.translations.get(key);
        if (!msg) return _returnType.assert(key);
        return _returnType.assert(msg.format(args));
      }
    });

    var language = app.context.language;
    return app.loadConfig(dirname + language).then(function (map) {
      app.translations = load(map, language);
      return map;
    });
  };
}

export default alpTranslate;
//# sourceMappingURL=index-browser-dev.es.js.map
