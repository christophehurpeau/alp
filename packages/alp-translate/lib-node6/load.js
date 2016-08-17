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

    (function loadMap(map, prefix) {
        map.forEach((value, key) => {
            if (typeof value === 'object') {
                return loadMap(value, `${ key }.`);
            }

            result.set(`${ prefix }${ key }`, new _intlMessageformat2.default(value, language));
        });
    })(translations, '');

    return result;
}
//# sourceMappingURL=load.js.map