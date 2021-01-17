'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('alp-router');
var objectProperties = require('object-properties');
var _inheritsLoose = require('@babel/runtime/helpers/esm/inheritsLoose');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e['default'] : e; }

var _inheritsLoose__default = /*#__PURE__*/_interopDefaultLegacy(_inheritsLoose);

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
  _inheritsLoose__default(ParamValueStringValidator, _ParamValueValidator);

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
      value
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
  _inheritsLoose__default(ParamValidatorValid, _ParamValidator);

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
    param(name) {
      return this.namedParam(name) || this.paramGET(name);
    },

    namedParam(name) {
      var namedParams = this.route.namedParams;
      return namedParams == null ? void 0 : namedParams.get(name);
    },

    otherParam(position) {
      var otherParams = this.route.otherParams;
      return otherParams && otherParams[position - 1];
    },

    paramGET(name) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      var query = this.request.query; // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return

      return query == null ? void 0 : query[name];
    },

    paramGETorPOST(name) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
      return this.body[name] !== undefined ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.body[name] : // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.request.query[name];
    }

  });
  objectProperties.defineLazyProperty(app.context, 'params', function () {
    return new ParamValidator(this);
  });
  objectProperties.defineLazyProperty(app.context, 'validParams', function () {
    return new ParamValidatorValid(this);
  });
}

exports.ParamValidator = ParamValidator;
exports.default = alpParams;
//# sourceMappingURL=index-browser.cjs.js.map
