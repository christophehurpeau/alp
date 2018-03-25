'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var objectProperties = require('object-properties');
var t = _interopDefault(require('flow-runtime'));

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
      let _nameType = t.string();

      const _returnType = t.return(t.nullable(t.string()));

      t.param('name', _nameType).assert(name);

      return _returnType.assert(this.namedParam(name) || this.paramGET(name));
    },

    namedParam(name) {
      let _nameType2 = t.string();

      const _returnType2 = t.return(t.nullable(t.string()));

      t.param('name', _nameType2).assert(name);

      const namedParams = this.route.namedParams;
      return _returnType2.assert(namedParams && namedParams.get(name));
    },

    otherParam(position) {
      let _positionType = t.number();

      const _returnType3 = t.return(t.nullable(t.string()));

      t.param('position', _positionType).assert(position);

      const otherParams = this.route.otherParams;
      return _returnType3.assert(otherParams && otherParams[position - 1]);
    },

    paramGET(name) {
      let _nameType3 = t.string();

      const _returnType4 = t.return(t.nullable(t.string()));

      t.param('name', _nameType3).assert(name);

      const query = this.query;
      return _returnType4.assert(query && query[name]);
    },

    paramGETorPOST(name) {
      let _nameType4 = t.string();

      const _returnType5 = t.return(t.nullable(t.string()));

      t.param('name', _nameType4).assert(name);

      return _returnType5.assert(this.body[name] !== undefined ? this.body[name] : this.query[name]);
    }
  });

  objectProperties.defineLazyProperty(app.context, 'params', function () {
    const _returnType6 = t.return(t.ref(ParamValidator));

    return _returnType6.assert(new ParamValidator(this));
  });

  objectProperties.defineLazyProperty(app.context, 'validParams', function () {
    const _returnType7 = t.return(t.ref(ParamValidatorValid));

    return _returnType7.assert(new ParamValidatorValid(this));
  });
}

exports.ParamValidator = ParamValidator;
exports.default = alpParams;
//# sourceMappingURL=index-node8-dev.cjs.js.map
