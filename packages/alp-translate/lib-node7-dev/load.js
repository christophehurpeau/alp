'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = load;

var _intlMessageformat = require('intl-messageformat');

var _intlMessageformat2 = _interopRequireDefault(_intlMessageformat);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function load(translations, language) {
  let _translationsType = _flowRuntime2.default.ref('Map', _flowRuntime2.default.string(), _flowRuntime2.default.any());

  let _languageType = _flowRuntime2.default.string();

  _flowRuntime2.default.param('translations', _translationsType).assert(translations);

  _flowRuntime2.default.param('language', _languageType).assert(language);

  const result = new Map();

  (function loadMap(map, prefix) {
    map.forEach((value, key) => {
      if (typeof value === 'object') {
        return loadMap(value, `${prefix}${key}.`);
      }

      result.set(`${prefix}${key}`, new _intlMessageformat2.default(value, language));
    });
  })(translations, '');

  return result;
}
//# sourceMappingURL=load.js.map