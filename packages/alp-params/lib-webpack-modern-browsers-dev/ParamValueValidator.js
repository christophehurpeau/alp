export default class ParamValueValidator {
  constructor(validator, name, value) {
    this.validator = validator;
    this.name = name;
    this.value = value;
  }

  _error(key) {
    this.validator._error(this.name, key, this.value);
  }
}
//# sourceMappingURL=ParamValueValidator.js.map