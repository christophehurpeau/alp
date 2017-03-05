'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsxFileName = 'AlpReduxApp.jsx';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _AlpReactApp = require('./AlpReactApp');

var _AlpReactApp2 = _interopRequireDefault(_AlpReactApp);

var _types = require('./types');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const ReactNodeType = _flowRuntime2.default.tdz(() => _types.ReactNodeType);

const ReactElementType = _flowRuntime2.default.tdz(() => _types.ReactElementType);

const PropsType = _flowRuntime2.default.type('PropsType', _flowRuntime2.default.object(_flowRuntime2.default.property('children', _flowRuntime2.default.ref(ReactNodeType)), _flowRuntime2.default.property('store', _flowRuntime2.default.object())));

exports.default = function alpReduxApp(_ref) {
  let { children, store } = _ref,
      props = _objectWithoutProperties(_ref, ['children', 'store']);

  const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.ref(ReactElementType));

  _flowRuntime2.default.param('arguments[0]', PropsType).assert(arguments[0]);

  return _returnType.assert(_react2.default.createElement(
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
  ));
};
//# sourceMappingURL=AlpReduxApp.js.map