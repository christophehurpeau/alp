import type ParamValidator from './ParamValidator';

export default class ParamValueValidator<T> {
  readonly validator: ParamValidator;

  readonly name: string;

  readonly value: T;

  constructor(validator: ParamValidator, name: string, value: T) {
    this.validator = validator;
    this.name = name;
    this.value = value;
  }

  _error(key: string): void {
    this.validator._error(this.name, key, this.value);
  }
}
