var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import ParamValueStringValidator from './ParamValueStringValidator';

var ParamValidator = function () {
  function ParamValidator(context) {
    _classCallCheck(this, ParamValidator);

    this.context = context;
  }

  _createClass(ParamValidator, [{
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
     }*/

  }]);

  return ParamValidator;
}();

export default ParamValidator;
//# sourceMappingURL=ParamValidator.js.map