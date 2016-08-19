"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
class ParamValueValidator {
  constructor(validator, name, value) {
    this.validator = validator;
    this.name = name;
    this.value = value;
  }

  _error(key) {
    this.validator._error(this.name, key, this.value);
  }
}
exports.default = ParamValueValidator;
//# sourceMappingURL=ParamValueValidator.js.map