function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function"); }

function _possibleConstructorReturn(self, call) { if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass); }

import ParamValueValidator from './ParamValueValidator';

var ParamValueModelValidator = function (_ParamValueValidator) {
    function ParamValueModelValidator() {
        return _classCallCheck(this, ParamValueModelValidator), _possibleConstructorReturn(this, (ParamValueModelValidator.__proto__ || Object.getPrototypeOf(ParamValueModelValidator)).apply(this, arguments));
    }

    return _inherits(ParamValueModelValidator, _ParamValueValidator), ParamValueModelValidator;
}(ParamValueValidator);

export { ParamValueModelValidator as default };
//# sourceMappingURL=ParamValueModelValidator.js.map