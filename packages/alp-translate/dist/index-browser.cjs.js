'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var IntlMessageFormat = _interopDefault(require('intl-messageformat'));

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

function alpTranslate(dirname) {
  dirname = dirname.replace(/\/*$/, '/');
  return function (app) {
    Object.assign(app.context, {
      t: function t(key, args) {
        var msg = app.translations.get(key);
        if (!msg) return key;
        return msg.format(args);
      }
    });

    var language = app.context.language;
    return app.loadConfig(dirname + language).then(function (map) {
      app.translations = load(map, language);
      return map;
    });
  };
}

module.exports = alpTranslate;
//# sourceMappingURL=index-browser.cjs.js.map
