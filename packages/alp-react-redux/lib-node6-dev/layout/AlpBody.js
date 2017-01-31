'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsxFileName = 'layout/AlpBody.jsx',
    _arguments = arguments;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _fody = require('fody');

var _types = require('../types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const PropsType = _tcombForked2.default.interface({
  children: _types.ReactNodeType
}, 'PropsType');

exports.default = function alpBody(_ref) {
  let _assert2 = _assert(_ref, PropsType, '{ children, ...props }'),
      { children } = _assert2,
      props = _objectWithoutProperties(_assert2, ['children']);

  _assert({
    children,
    props
  }, PropsType, '{ children, ...props }');

  return _assert(function () {
    return _react2.default.createElement(
      _fody.Body,
      _extends({}, props, {
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 9
        }
      }),
      _react2.default.createElement(
        'div',
        { id: 'loading-bar', className: 'loading-bar', __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 10
          }
        },
        _react2.default.createElement('div', { className: 'progress', __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 10
          }
        })
      ),
      children
    );
  }.apply(undefined, _arguments), _types.ReactElementType, 'return value');
};

function _assert(x, type, name) {
  if (_tcombForked2.default.isType(type) && type.meta.kind !== 'struct') {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail('Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')');
  }

  return x;
}
//# sourceMappingURL=AlpBody.js.map