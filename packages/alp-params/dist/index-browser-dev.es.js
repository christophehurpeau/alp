import 'alp-router';
import { defineLazyProperty } from 'object-properties';
import _inheritsLoose from '@babel/runtime/helpers/esm/inheritsLoose';

var ParamValueValidator = /*#__PURE__*/function () {
  function ParamValueValidator(validator, name, value) {
    this.validator = validator;
    this.name = name;
    this.value = value;
  }

  var _proto = ParamValueValidator.prototype;

  _proto._error = function _error(key) {
    this.validator._error(this.name, key, this.value);
  };

  return ParamValueValidator;
}();

var ParamValueStringValidator = /*#__PURE__*/function (_ParamValueValidator) {
  _inheritsLoose(ParamValueStringValidator, _ParamValueValidator);

  function ParamValueStringValidator() {
    return _ParamValueValidator.apply(this, arguments) || this;
  }

  var _proto = ParamValueStringValidator.prototype;

  _proto.notEmpty = function notEmpty() {
    if (this.value == null || this.value.trim() === '') {
      this._error('notEmpty');
    }

    return this;
  };

  return ParamValueStringValidator;
}(ParamValueValidator);

var ParamValidator = /*#__PURE__*/function () {
  function ParamValidator(context) {
    this.context = context;
  }

  var _proto = ParamValidator.prototype;

  _proto._error = function _error(name, key, value) {
    if (!this._errors) {
      this._errors = {};
    }

    this._errors[name] = {
      error: key,
      value: value
    };
  };

  _proto.getErrors = function getErrors() {
    return this._errors;
  };

  _proto.hasErrors = function hasErrors() {
    return this._errors !== undefined;
  };

  _proto.isValid = function isValid() {
    return this._errors === undefined;
  };

  _proto.string = function string(name) {
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
  ;

  return ParamValidator;
}();

var ParamValidatorValid = /*#__PURE__*/function (_ParamValidator) {
  _inheritsLoose(ParamValidatorValid, _ParamValidator);

  function ParamValidatorValid() {
    return _ParamValidator.apply(this, arguments) || this;
  }

  var _proto = ParamValidatorValid.prototype;

  _proto._error = function _error() {
    this.context.throw(404, 'Invalid params', {
      validator: this
    });
  };

  return ParamValidatorValid;
}(ParamValidator);

function alpParams(app) {
  Object.assign(app.context, {
    param: function param(name) {
      return this.namedParam(name) || this.paramGET(name);
    },
    namedParam: function namedParam(name) {
      var namedParams = this.route.namedParams;
      return namedParams == null ? void 0 : namedParams.get(name);
    },
    otherParam: function otherParam(position) {
      var otherParams = this.route.otherParams;
      return otherParams && otherParams[position - 1];
    },
    paramGET: function paramGET(name) {
      var query = this.request.query;
      return query == null ? void 0 : query[name];
    },
    paramGETorPOST: function paramGETorPOST(name) {
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
//# sourceMappingURL=index-browser-dev.es.js.map
