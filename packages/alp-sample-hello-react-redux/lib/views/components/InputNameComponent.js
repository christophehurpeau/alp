"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class InputNameComponent extends _react.Component {

    render() {
        var _props = this.props;
        const name = _props.name;
        const setName = _props.setName;

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
}
exports.default = InputNameComponent;
InputNameComponent.propTypes = {
    name: _react.PropTypes.string.isRequired,
    setName: _react.PropTypes.func.isRequired
};
//# sourceMappingURL=InputNameComponent.js.map
