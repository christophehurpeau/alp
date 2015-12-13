'use strict';

var _get = require('babel-runtime/helpers/get').default;

var _inherits = require('babel-runtime/helpers/inherits').default;

var _createClass = require('babel-runtime/helpers/create-class').default;

var _classCallCheck = require('babel-runtime/helpers/class-call-check').default;

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default').default;

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _turaco = require('turaco');

var _InputNameComponent = require('./InputNameComponent');

var _InputNameComponent2 = _interopRequireDefault(_InputNameComponent);

let HelloComponent = (function (_Component) {
    _inherits(HelloComponent, _Component);

    function HelloComponent() {
        _classCallCheck(this, HelloComponent);

        _get(Object.getPrototypeOf(HelloComponent.prototype), 'constructor', this).apply(this, arguments);

        this.elements = ['span'];
        this.components = ['input'];
    }

    _createClass(HelloComponent, [{
        key: 'render',
        value: function render(_ref) {
            let name = _ref.name;

            const InputName = this.component(_InputNameComponent2.default);
            this.$container.append(this.$span = React.createElement('span', null)).append(this.input = React.createElement(InputName, { name: name }));
            this.setName(name);
        }
    }, {
        key: 'ready',
        value: function ready() {
            this.input.on('nameChanged', newName => {
                this.setName(newName);
            });
        }
    }, {
        key: 'setName',
        value: function setName(name) {
            const hello = this.context.t('Hello {0}!', name || 'World');
            this.$span.text(hello);
        }
    }]);

    return HelloComponent;
})(_turaco.Component);

exports.default = HelloComponent;
module.exports = exports.default;
//# sourceMappingURL=HelloComponent.js.map
