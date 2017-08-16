import ParamValueStringValidator from './ParamValueStringValidator';

export default class ParamValidator {
  constructor(context) {
    this.context = context;
  }

  _error(name, key, value) {
    if (!this._errors) {
      this._errors = {};
    }

    this._errors[name] = { error: key, value };
  }

  getErrors() {
    return this._errors;
  }

  hasErrors() {
    return !!this._errors;
  }

  isValid() {
    return !this._errors;
  }

  string(name, position) {
    return new ParamValueStringValidator(this, name, this.context.param(name, position));
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
