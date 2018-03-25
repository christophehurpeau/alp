import IntlMessageFormat from 'intl-messageformat';
import Logger from 'nightingale-logger';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

function load(translations, language) {
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
  dirname = dirname.replace(/\/*$/, '/');
  return function (app) {
    Object.assign(app.context, {
      t: function t(key, args) {
        var msg = app.translations.get(this.language).get(key);
        if (!msg) {
          logger.warn('invalid msg', { language: this.language, key: key });
          return key;
        }

        return msg.format(args);
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
//# sourceMappingURL=index-browser.es.js.map
