'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _InputNameComponent = require('./InputNameComponent');

var _InputNameComponent2 = _interopRequireDefault(_InputNameComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class HelloComponent extends _react.Component {

    render() {
        var _props = this.props;
        const name = _props.name;
        const setName = _props.setName;

        return _react2.default.createElement(
            'div',
            { className: 'hello-component' },
            _react2.default.createElement(
                'div',
                { className: 'hello-name' },
                this.context.context.t('Hello {0}!', name || 'World')
            ),
            _react2.default.createElement(_InputNameComponent2.default, { name: name, setName: setName })
        );
    }
}
exports.default = HelloComponent;
HelloComponent.contextTypes = {
    context: _react.PropTypes.object.isRequired
};
HelloComponent.propTypes = {
    name: _react.PropTypes.string.isRequired,
    setName: _react.PropTypes.func.isRequired
};
//# sourceMappingURL=HelloComponent.js.map
