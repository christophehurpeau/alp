import ParamValidator from './ParamValidator';

let ParamValidatorValid = class extends ParamValidator {
  _error() {
    this.context.throw(404, 'Invalid params', { validator: this });
  }
};
export { ParamValidatorValid as default };
//# sourceMappingURL=ParamValidatorValid.js.map