"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = InputNameComponent;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

InputNameComponent.propTypes = {
    name: _react.PropTypes.string.isRequired,
    setName: _react.PropTypes.func.isRequired
};

function InputNameComponent(_ref) {
    let name = _ref.name;
    let setName = _ref.setName;

    return _react2.default.createElement("input", {
        autoComplete: "off",
        type: "text",
        defaultValue: name,
        onKeyUp: e => {
            return setName(e.target.value);
        },
        onChange: e => {
            return setName(e.target.value);
        }
    });
}
//# sourceMappingURL=InputNameComponent.js.map
