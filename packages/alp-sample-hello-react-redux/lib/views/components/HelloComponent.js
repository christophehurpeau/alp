'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = HelloComponent;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _InputNameComponent = require('./InputNameComponent');

var _InputNameComponent2 = _interopRequireDefault(_InputNameComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

HelloComponent.contextTypes = {
    context: _react.PropTypes.object.isRequired
};

HelloComponent.propTypes = {
    name: _react.PropTypes.string.isRequired,
    setName: _react.PropTypes.func.isRequired
};

function HelloComponent(_ref, _ref2) {
    let name = _ref.name;
    let setName = _ref.setName;
    let context = _ref2.context;

    return _react2.default.createElement(
        'div',
        { className: 'hello-component' },
        _react2.default.createElement(
            'div',
            { className: 'hello-name' },
            context.t('Hello {name}!', { name: name || 'World' })
        ),
        _react2.default.createElement(_InputNameComponent2.default, { name: name, setName: setName })
    );
}
//# sourceMappingURL=HelloComponent.js.map
