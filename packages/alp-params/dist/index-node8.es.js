import { defineLazyProperty } from 'object-properties';

let ParamValueValidator = class {
  constructor(validator, name, value) {
    this.validator = validator;
    this.name = name;
    this.value = value;
  }

  _error(key) {
    this.validator._error(this.name, key, this.value);
  }
};

let ParamValueStringValidator = class extends ParamValueValidator {
  notEmpty() {
    if (this.value == null || this.value.trim() === '') {
      this._error('notEmpty');
    }

    return this;
  }
};

let ParamValidator = class {
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
};

let ParamValidatorValid = class extends ParamValidator {
  _error() {
    this.context.throw(404, 'Invalid params', { validator: this });
  }
};

function alpParams(app) {
  Object.assign(app.context, {
    param(name) {
      return this.namedParam(name) || this.paramGET(name);
    },

    namedParam(name) {
      const namedParams = this.route.namedParams;
      return namedParams && namedParams.get(name);
    },

    otherParam(position) {
      const otherParams = this.route.otherParams;
      return otherParams && otherParams[position - 1];
    },

    paramGET(name) {
      const query = this.query;
      return query && query[name];
    },

    paramGETorPOST(name) {
      return this.body[name] !== undefined ? this.body[name] : this.query[name];
    }
  });

  defineLazyProperty(app.context, 'params', function () {
    return new ParamValidator(this);
  });

  defineLazyProperty(app.context, 'validParams', function () {
    return new ParamValidatorValid(this);
  });
}

export default alpParams;
export { ParamValidator };
//# sourceMappingURL=index-node8.es.js.map
