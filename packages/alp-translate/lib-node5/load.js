'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = load;

var _intlMessageformat = require('intl-messageformat');

var _intlMessageformat2 = _interopRequireDefault(_intlMessageformat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function load(translations, language) {
    translations.forEach((value, key) => {
        translations.set(key, new _intlMessageformat2.default(value, language));
    });

    return translations;
}
//# sourceMappingURL=load.js.map