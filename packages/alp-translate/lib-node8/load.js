'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = load;

var _intlMessageformat = require('intl-messageformat');

var _intlMessageformat2 = _interopRequireDefault(_intlMessageformat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function load(translations, language) {
  const result = new Map();

  return function loadMap(map, prefix) {
    map.forEach((value, key) => typeof value === 'object' ? loadMap(value, `${prefix}${key}.`) : void result.set(`${prefix}${key}`, new _intlMessageformat2.default(value, language)));
  }(translations, ''), result;
}
//# sourceMappingURL=load.js.map