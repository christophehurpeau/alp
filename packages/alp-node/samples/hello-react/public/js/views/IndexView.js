'use strict';

var _get = require('babel-runtime/helpers/get').default;

var _inherits = require('babel-runtime/helpers/inherits').default;

var _createClass = require('babel-runtime/helpers/create-class').default;

var _classCallCheck = require('babel-runtime/helpers/class-call-check').default;

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default').default;

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

/** @class IndexView */
let IndexView = (function (_Component) {
    _inherits(IndexView, _Component);

    function IndexView() {
        _classCallCheck(this, IndexView);

        _get(Object.getPrototypeOf(IndexView.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(IndexView, [{
        key: 'render',
        /** @memberof IndexView 
        * @instance 
        * @method render */value: function render() {
            const title = 'React Index View';
            this.context.setTitle(title);
            const name = this.props.name;
            return _react2.default.createElement(
                'div',
                null,
                this.context.t('Hello %s!', name || 'World')
            );
        }
    }], [{
        key: 'contextTypes',
        value: {
            setTitle: _react.PropTypes.func.isRequired,
            t: _react.PropTypes.func.isRequired
        },
        enumerable: true
    }, {
        key: 'propTypes',
        value: {
            name: _react.PropTypes.string
        },
        enumerable: true
    }]);

    return IndexView;
})(_react.Component);

exports.default = IndexView;
module.exports = exports.default;
//# sourceMappingURL=IndexView.js.map
