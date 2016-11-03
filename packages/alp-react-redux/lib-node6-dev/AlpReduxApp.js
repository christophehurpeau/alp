'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsxFileName = 'AlpReduxApp.jsx';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _reactRedux = require('react-redux');

var _AlpReactApp = require('./AlpReactApp');

var _AlpReactApp2 = _interopRequireDefault(_AlpReactApp);

var _types = require('./types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const PropsType = _tcombForked2.default.interface({
  children: _types.ReactNodeType,
  store: _tcombForked2.default.Object
}, 'PropsType');

exports.default = (_ref) => {
  var _assert2 = _assert(_ref, PropsType, '{ children, store, ...props }');

  let children = _assert2.children,
      store = _assert2.store,
      props = _objectWithoutProperties(_assert2, ['children', 'store']);

  _assert({
    children,
    store,
    props
  }, PropsType, '{ children, store, ...props }');

  return _assert((() => {
    return _react2.default.createElement(
      _reactRedux.Provider,
      { store: store, __self: undefined,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 11
        }
      },
      _react2.default.createElement(
        _AlpReactApp2.default,
        _extends({}, props, {
          __self: undefined,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 12
          }
        }),
        children
      )
    );
  })(), _types.ReactElementType, 'return value');
};

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')';
  }

  if (_tcombForked2.default.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);

      _tcombForked2.default.fail(message());
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=AlpReduxApp.js.map