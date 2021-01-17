import ParamValueValidator from './ParamValueValidator';

export default class ParamValueStringValidator<
  T extends string = string
> extends ParamValueValidator<T | undefined | null> {
  notEmpty(): ParamValueValidator<T> {
    if (this.value == null || this.value.trim() === '') {
      this._error('notEmpty');
    }

    return this as ParamValueValidator<T>;
  }
}
