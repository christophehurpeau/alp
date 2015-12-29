"use strict";

var _class, _temp;

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let InputNameComponent = (_temp = _class = class InputNameComponent extends _react.Component {

    render() {
        var _props = this.props;
        const name = _props.name;
        const setName = _props.setName;

        return _react2.default.createElement("input", { autoComplete: "off", type: "text", defaultValue: name, onKeyUp: e => setName(e.target.value) });
    }
}, _class.propTypes = {
    name: _react.PropTypes.string.isRequired,
    setName: _react.PropTypes.func.isRequired
}, _temp);
exports.default = InputNameComponent;
//# sourceMappingURL=InputNameComponent.js.map
