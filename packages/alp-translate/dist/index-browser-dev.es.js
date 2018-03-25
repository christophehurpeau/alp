import IntlMessageFormat from 'intl-messageformat';
import _t from 'flow-runtime';
import Logger from 'nightingale-logger';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

function load(translations, language) {
  var _translationsType = _t.ref('Map', _t.string(), _t.any());

  var _languageType = _t.string();

  _t.param('translations', _translationsType).assert(translations);
  _t.param('language', _languageType).assert(language);

  var result = new Map();

  (function loadMap(map, prefix) {
    map.forEach(function (value, key) {
      if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
        return loadMap(value, '' + prefix + key + '.');
      }

      result.set('' + prefix + key, new IntlMessageFormat(value, language));
    });
  })(translations, '');

  return result;
}

var logger = new Logger('alp:translate');

function alpTranslate(dirname) {
  var _dirnameType = _t.string();

  _t.param('dirname', _dirnameType).assert(dirname);

  dirname = _dirnameType.assert(dirname.replace(/\/*$/, '/'));
  return function (app) {
    Object.assign(app.context, {
      t: function t(key, args) {
        var _keyType = _t.string();

        var _argsType = _t.nullable(_t.object());

        var _returnType = _t.return(_t.string());

        _t.param('key', _keyType).assert(key);

        _t.param('args', _argsType).assert(args);

        var msg = app.translations.get(this.language).get(key);
        if (!msg) {
          logger.warn('invalid msg', { language: this.language, key: key });
          return _returnType.assert(key);
        }

        return _returnType.assert(msg.format(args));
      }
    });

    app.translations = new Map();
    app.config.get('availableLanguages').forEach(function (language) {
      var translations = app.config.loadConfigSync(dirname + language);
      app.translations.set(language, load(translations, language));
    });
  };
}

export default alpTranslate;
//# sourceMappingURL=index-browser-dev.es.js.map
