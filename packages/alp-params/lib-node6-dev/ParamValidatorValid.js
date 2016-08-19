'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ParamValidator = require('./ParamValidator');

var _ParamValidator2 = _interopRequireDefault(_ParamValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ParamValidatorValid extends _ParamValidator2.default {
  _error() {
    this.context.throw(404, 'Invalid params', { validator: this });
  }
}
exports.default = ParamValidatorValid;
//# sourceMappingURL=ParamValidatorValid.js.map