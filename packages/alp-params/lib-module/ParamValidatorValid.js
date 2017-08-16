var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false, descriptor.configurable = true, "value" in descriptor && (descriptor.writable = true), Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function"); }

function _possibleConstructorReturn(self, call) { if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass); }

import ParamValidator from './ParamValidator';

var ParamValidatorValid = function (_ParamValidator) {
  function ParamValidatorValid() {
    return _classCallCheck(this, ParamValidatorValid), _possibleConstructorReturn(this, (ParamValidatorValid.__proto__ || Object.getPrototypeOf(ParamValidatorValid)).apply(this, arguments));
  }

  return _inherits(ParamValidatorValid, _ParamValidator), _createClass(ParamValidatorValid, [{
    key: '_error',
    value: function _error() {
      this.context.throw(404, 'Invalid params', { validator: this });
    }
  }]), ParamValidatorValid;
}(ParamValidator);

export { ParamValidatorValid as default };
//# sourceMappingURL=ParamValidatorValid.js.map