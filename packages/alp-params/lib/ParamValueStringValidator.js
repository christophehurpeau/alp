'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ParamValueValidator = require('./ParamValueValidator');

var _ParamValueValidator2 = _interopRequireDefault(_ParamValueValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ParamValueStringValidator extends _ParamValueValidator2.default {
    notEmpty() {
        if (this.value == null || this.value.trim() === '') {
            this._error('notEmpty');
        }

        return this;
    }
}
exports.default = ParamValueStringValidator;
//# sourceMappingURL=ParamValueStringValidator.js.map