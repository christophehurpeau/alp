import type ParamValidator from './ParamValidator';

export default class ParamValueValidator {
  validator: ParamValidator;

  name: string;

  value: any;

  constructor(validator: ParamValidator, name: string, value: any) {
    this.validator = validator;
    this.name = name;
    this.value = value;
  }

  _error(key: string) {
    this.validator._error(this.name, key, this.value);
  }
}
