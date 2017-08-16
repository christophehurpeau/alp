'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ParamValueValidator = require('./ParamValueValidator');

var _ParamValueValidator2 = _interopRequireDefault(_ParamValueValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let ParamValueStringValidator = class extends _ParamValueValidator2.default {
  notEmpty() {

    return (this.value == null || this.value.trim() === '') && this._error('notEmpty'), this;
  }
};
exports.default = ParamValueStringValidator;
//# sourceMappingURL=ParamValueStringValidator.js.map