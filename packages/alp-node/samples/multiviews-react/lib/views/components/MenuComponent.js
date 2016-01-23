'use strict';

var _class, _temp;

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let MenuComponent = (_temp = _class = class MenuComponent extends _react.Component {

    render() {
        return _react2.default.createElement(
            'div',
            { className: 'menu' },
            _react2.default.createElement(
                'ul',
                null,
                _react2.default.createElement(
                    'li',
                    null,
                    _react2.default.createElement(
                        'a',
                        { href: this.context.context.urlGenerator('default', { action: 'view1' }) },
                        'View 1'
                    )
                ),
                _react2.default.createElement(
                    'li',
                    null,
                    _react2.default.createElement(
                        'a',
                        { href: this.context.context.urlGenerator('default', { action: 'view2' }) },
                        'View 2'
                    )
                )
            )
        );
    }
}, _class.contextTypes = {
    context: _react.PropTypes.object.isRequired
}, _temp);
exports.default = MenuComponent;
//# sourceMappingURL=MenuComponent.js.map
