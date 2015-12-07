'use strict';

var _get = require('babel-runtime/helpers/get').default;

var _inherits = require('babel-runtime/helpers/inherits').default;

var _createClass = require('babel-runtime/helpers/create-class').default;

var _classCallCheck = require('babel-runtime/helpers/class-call-check').default;

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _turaco = require('turaco');

let InputNameComponent = (function (_Component) {
    _inherits(InputNameComponent, _Component);

    function InputNameComponent() {
        _classCallCheck(this, InputNameComponent);

        _get(Object.getPrototypeOf(InputNameComponent.prototype), 'constructor', this).apply(this, arguments);

        this.elements = ['input'];
    }

    _createClass(InputNameComponent, [{
        key: 'init',
        value: function init(_ref) {
            let name = _ref.name;

            this.name = name || '';
        }
    }, {
        key: 'render',
        value: function render() {
            return this.$input = React.createElement('input', { autocomplete: 'off', type: 'text', value: this.name });
        }
    }, {
        key: 'ready',
        value: function ready() {
            this.$input.on('keyup', e => {
                const newName = e.$element.getValue();
                if (this.name != newName) {
                    this.name = newName;
                    this.emit('nameChanged', newName);
                }
            });
        }
    }]);

    return InputNameComponent;
})(_turaco.Component);

exports.default = InputNameComponent;
module.exports = exports.default;
//# sourceMappingURL=InputNameComponent.js.map
