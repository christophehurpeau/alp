'use strict';

var _class, _temp;

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _MenuComponent = require('../components/MenuComponent');

var _MenuComponent2 = _interopRequireDefault(_MenuComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let MainLayout = (_temp = _class = class MainLayout extends _react.Component {

    render() {
        return _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
                'header',
                null,
                _react2.default.createElement(_MenuComponent2.default, null)
            ),
            _react2.default.createElement(
                'div',
                { className: 'content' },
                this.props.children
            )
        );
    }
}, _class.propTypes = {
    children: _react.PropTypes.element.isRequired
}, _temp);
exports.default = MainLayout;
//# sourceMappingURL=MainLayout.js.map
