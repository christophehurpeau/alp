'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var objectProperties = require('object-properties');

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var ParamValueValidator = function () {
  function ParamValueValidator(validator, name, value) {
    classCallCheck(this, ParamValueValidator);

    this.validator = validator;
    this.name = name;
    this.value = value;
  }

  createClass(ParamValueValidator, [{
    key: "_error",
    value: function _error(key) {
      this.validator._error(this.name, key, this.value);
    }
  }]);
  return ParamValueValidator;
}();

var ParamValueStringValidator = function (_ParamValueValidator) {
  inherits(ParamValueStringValidator, _ParamValueValidator);

  function ParamValueStringValidator() {
    classCallCheck(this, ParamValueStringValidator);
    return possibleConstructorReturn(this, (ParamValueStringValidator.__proto__ || Object.getPrototypeOf(ParamValueStringValidator)).apply(this, arguments));
  }

  createClass(ParamValueStringValidator, [{
    key: 'notEmpty',
    value: function notEmpty() {
      if (this.value == null || this.value.trim() === '') {
        this._error('notEmpty');
      }

      return this;
    }
  }]);
  return ParamValueStringValidator;
}(ParamValueValidator);

var ParamValidator = function () {
  function ParamValidator(context) {
    classCallCheck(this, ParamValidator);

    this.context = context;
  }

  createClass(ParamValidator, [{
    key: '_error',
    value: function _error(name, key, value) {
      if (!this._errors) {
        this._errors = {};
      }

      this._errors[name] = { error: key, value: value };
    }
  }, {
    key: 'getErrors',
    value: function getErrors() {
      return this._errors;
    }
  }, {
    key: 'hasErrors',
    value: function hasErrors() {
      return !!this._errors;
    }
  }, {
    key: 'isValid',
    value: function isValid() {
      return !this._errors;
    }
  }, {
    key: 'string',
    value: function string(name, position) {
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

  }]);
  return ParamValidator;
}();

var ParamValidatorValid = function (_ParamValidator) {
  inherits(ParamValidatorValid, _ParamValidator);

  function ParamValidatorValid() {
    classCallCheck(this, ParamValidatorValid);
    return possibleConstructorReturn(this, (ParamValidatorValid.__proto__ || Object.getPrototypeOf(ParamValidatorValid)).apply(this, arguments));
  }

  createClass(ParamValidatorValid, [{
    key: '_error',
    value: function _error() {
      this.context.throw(404, 'Invalid params', { validator: this });
    }
  }]);
  return ParamValidatorValid;
}(ParamValidator);

function alpParams(app) {
  Object.assign(app.context, {
    param: function param(name) {
      return this.namedParam(name) || this.paramGET(name);
    },
    namedParam: function namedParam(name) {
      var namedParams = this.route.namedParams;
      return namedParams && namedParams.get(name);
    },
    otherParam: function otherParam(position) {
      var otherParams = this.route.otherParams;
      return otherParams && otherParams[position - 1];
    },
    paramGET: function paramGET(name) {
      var query = this.query;
      return query && query[name];
    },
    paramGETorPOST: function paramGETorPOST(name) {
      return this.body[name] !== undefined ? this.body[name] : this.query[name];
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
