import ParamValueValidator from './ParamValueValidator';

export default class ParamValueStringValidator extends ParamValueValidator {
  notEmpty(): this {
    if (this.value == null || this.value.trim() === '') {
      this._error('notEmpty');
    }

    return this;
  }
}
