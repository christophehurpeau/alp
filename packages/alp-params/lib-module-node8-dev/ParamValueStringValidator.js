import ParamValueValidator from './ParamValueValidator';

let ParamValueStringValidator = class extends ParamValueValidator {
  notEmpty() {

    return (this.value == null || this.value.trim() === '') && this._error('notEmpty'), this;
  }
};
export { ParamValueStringValidator as default };
//# sourceMappingURL=ParamValueStringValidator.js.map