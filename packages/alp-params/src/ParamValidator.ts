import type { Context } from 'alp-types';
import ParamValueStringValidator from './ParamValueStringValidator';

export interface Errors {
  [key: string]: any;
}

export default class ParamValidator {
  context: Context;

  _errors?: Errors;

  constructor(context: Context) {
    this.context = context;
  }

  _error(name: string, key: string, value: unknown): void {
    if (!this._errors) {
      this._errors = {};
    }

    this._errors[name] = { error: key, value };
  }

  getErrors(): Errors | undefined {
    return this._errors;
  }

  hasErrors(): boolean {
    return this._errors !== undefined;
  }

  isValid(): boolean {
    return this._errors === undefined;
  }

  string(name: string): ParamValueStringValidator {
    return new ParamValueStringValidator(this, name, this.context.param(name));
  }
  /* int(name, position) {
   return new ParamValueIntValidator(this, name, this.context.param(name, position));
   }
   model(modelName, name) {
   name = name || S.string.lcFirst(modelName);
   console.log('paramvalidator model', modelName, M[modelName]);
   let data = this.context.getOrPostParam(name);
   return new ParamValueModelValidator(this, name, !data ? null : new M[modelName](data));
   } */
}
