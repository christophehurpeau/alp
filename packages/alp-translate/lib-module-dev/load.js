var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import IntlMessageFormat from 'intl-messageformat';

import t from 'flow-runtime';
export default function load(translations, language) {
  var _translationsType = t.ref('Map', t.string(), t.any());

  var _languageType = t.string();

  t.param('translations', _translationsType).assert(translations), t.param('language', _languageType).assert(language);

  var result = new Map();

  return function loadMap(map, prefix) {
    map.forEach(function (value, key) {
      return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' ? loadMap(value, '' + prefix + key + '.') : void result.set('' + prefix + key, new IntlMessageFormat(value, language));
    });
  }(translations, ''), result;
}
//# sourceMappingURL=load.js.map