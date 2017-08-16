'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ParamValidator = require('./ParamValidator');

var _ParamValidator2 = _interopRequireDefault(_ParamValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let ParamValidatorValid = class extends _ParamValidator2.default {
  _error() {
    this.context.throw(404, 'Invalid params', { validator: this });
  }
};
exports.default = ParamValidatorValid;
//# sourceMappingURL=ParamValidatorValid.js.map