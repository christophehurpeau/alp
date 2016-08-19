var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ParamValueValidator = function () {
  function ParamValueValidator(validator, name, value) {
    _classCallCheck(this, ParamValueValidator);

    this.validator = validator;
    this.name = name;
    this.value = value;
  }

  _createClass(ParamValueValidator, [{
    key: "_error",
    value: function _error(key) {
      this.validator._error(this.name, key, this.value);
    }
  }]);

  return ParamValueValidator;
}();

export default ParamValueValidator;
//# sourceMappingURL=ParamValueValidator.js.map