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

var _layoutsLayout = require('./layouts/Layout');

var _layoutsLayout2 = _interopRequireDefault(_layoutsLayout);

var _componentsHelloComponent = require('./components/HelloComponent');

var _componentsHelloComponent2 = _interopRequireDefault(_componentsHelloComponent);

let TuracoView = (function (_View) {
    _inherits(TuracoView, _View);

    function TuracoView() {
        _classCallCheck(this, TuracoView);

        _get(Object.getPrototypeOf(TuracoView.prototype), 'constructor', this).apply(this, arguments);

        this.parent = _layoutsLayout2.default;
    }

    _createClass(TuracoView, [{
        key: 'render',
        value: function render(_ref) {
            let name = _ref.name;

            this.title = 'Turaco View';
            this.$container.append(this.component(_componentsHelloComponent2.default)(null, { name }));
        }
    }]);

    return TuracoView;
})(_turaco.View);

exports.default = TuracoView;
module.exports = exports.default;
//# sourceMappingURL=TuracoView.js.map
