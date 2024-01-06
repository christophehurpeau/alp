import type { ParamValidationResult } from './ParamValidationResult';

export default class ParamValueValidator<T> {
  readonly validationResult: ParamValidationResult;

  readonly name: string;

  readonly value: T;

  constructor(validationResult: ParamValidationResult, name: string, value: T) {
    this.validationResult = validationResult;
    this.name = name;
    this.value = value;
  }

  isValid(): boolean {
    return this.validationResult.isValid();
  }

  _error(key: string): void {
    this.validationResult._error(this.name, key, this.value);
  }
}
