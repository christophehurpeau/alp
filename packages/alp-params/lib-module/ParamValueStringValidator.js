var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false, descriptor.configurable = true, "value" in descriptor && (descriptor.writable = true), Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function"); }

function _possibleConstructorReturn(self, call) { if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass); }

import ParamValueValidator from './ParamValueValidator';

var ParamValueStringValidator = function (_ParamValueValidator) {
  function ParamValueStringValidator() {
    return _classCallCheck(this, ParamValueStringValidator), _possibleConstructorReturn(this, (ParamValueStringValidator.__proto__ || Object.getPrototypeOf(ParamValueStringValidator)).apply(this, arguments));
  }

  return _inherits(ParamValueStringValidator, _ParamValueValidator), _createClass(ParamValueStringValidator, [{
    key: 'notEmpty',
    value: function notEmpty() {

      return (this.value == null || this.value.trim() === '') && this._error('notEmpty'), this;
    }
  }]), ParamValueStringValidator;
}(ParamValueValidator);

export { ParamValueStringValidator as default };
//# sourceMappingURL=ParamValueStringValidator.js.map