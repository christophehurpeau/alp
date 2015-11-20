'use strict';

var _get = require('babel-runtime/helpers/get').default;

var _inherits = require('babel-runtime/helpers/inherits').default;

var _createClass = require('babel-runtime/helpers/create-class').default;

var _classCallCheck = require('babel-runtime/helpers/class-call-check').default;

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default').default;

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _turacoLibView = require('turaco/lib/View');

var _turacoLibView2 = _interopRequireDefault(_turacoLibView);

var _layoutsLayout = require('./layouts/Layout');

var _layoutsLayout2 = _interopRequireDefault(_layoutsLayout);

/** @class TuracoView */
let TuracoView = (function (_View) {
    _inherits(TuracoView, _View);

    function TuracoView() {
        _classCallCheck(this, TuracoView);

        _get(Object.getPrototypeOf(TuracoView.prototype), 'constructor', this).call(this);
        this.title = 'Turaco View';
        this.parent = _layoutsLayout2.default;
    }

    _createClass(TuracoView, [{
        key: 'render',
        /** @memberof TuracoView 
        * @instance 
        * @method render 
        * @param */value: function render(_ref) {
            let name = _ref.name;

            return React.createElement(
                'div',
                null,
                this.t('Hello %s!', name || 'World')
            );
        }
    }]);

    return TuracoView;
})(_turacoLibView2.default);

exports.default = TuracoView;
module.exports = exports.default;
//# sourceMappingURL=TuracoView.js.map
