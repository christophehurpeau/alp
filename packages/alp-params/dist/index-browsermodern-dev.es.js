import 'alp-router';
import { defineLazyProperty } from 'object-properties';

class ParamValueValidator {
  constructor(validator, name, value) {
    this.validator = validator;
    this.name = name;
    this.value = value;
  }

  _error(key) {
    this.validator._error(this.name, key, this.value);
  }

}

class ParamValueStringValidator extends ParamValueValidator {
  notEmpty() {
    if (this.value == null || this.value.trim() === '') {
      this._error('notEmpty');
    }

    return this;
  }

}

class ParamValidator {
  constructor(context) {
    this.context = context;
  }

  _error(name, key, value) {
    if (!this._errors) {
      this._errors = {};
    }

    this._errors[name] = {
      error: key,
      value
    };
  }

  getErrors() {
    return this._errors;
  }

  hasErrors() {
    return this._errors !== undefined;
  }

  isValid() {
    return this._errors === undefined;
  }

  string(name) {
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

class ParamValidatorValid extends ParamValidator {
  _error() {
    this.context.throw(404, 'Invalid params', {
      validator: this
    });
  }

}

function alpParams(app) {
  Object.assign(app.context, {
    param(name) {
      return this.namedParam(name) || this.paramGET(name);
    },

    namedParam(name) {
      const namedParams = this.route.namedParams;
      return namedParams?.get(name);
    },

    otherParam(position) {
      const otherParams = this.route.otherParams;
      return otherParams && otherParams[position - 1];
    },

    paramGET(name) {
      const query = this.request.query;
      return query?.[name];
    },

    paramGETorPOST(name) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
      return this.body[name] !== undefined ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.body[name] : this.request.query[name];
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
//# sourceMappingURL=index-browsermodern-dev.es.js.map
