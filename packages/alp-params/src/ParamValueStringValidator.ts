import ParamValueValidator from './ParamValueValidator';

export default class ParamValueStringValidator<
  T extends string = string,
> extends ParamValueValidator<T | null | undefined> {
  notEmpty(): ParamValueValidator<T> {
    if (this.value == null || this.value.trim() === '') {
      this._error('notEmpty');
    }

    return this as ParamValueValidator<T>;
  }
}
