'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsxFileName = 'layout/AlpBody.jsx';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _fody = require('fody');

var _types = require('../types');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const ReactElementType = _flowRuntime2.default.tdz(() => _types.ReactElementType);

const ReactNodeType = _flowRuntime2.default.tdz(() => _types.ReactNodeType);

const PropsType = _flowRuntime2.default.type('PropsType', _flowRuntime2.default.object(_flowRuntime2.default.property('children', _flowRuntime2.default.ref(ReactNodeType))));

exports.default = function alpBody(_ref) {
  let { children } = _ref,
      props = _objectWithoutProperties(_ref, ['children']);

  const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.ref(ReactElementType));

  _flowRuntime2.default.param('arguments[0]', PropsType).assert(arguments[0]);

  return _returnType.assert(_react2.default.createElement(
    _fody.Body,
    _extends({}, props, {
      __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 9
      }
    }),
    _react2.default.createElement(
      'div',
      { id: 'loading-bar', className: 'loading-bar', __self: undefined,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 10
        }
      },
      _react2.default.createElement('div', { className: 'progress', __self: undefined,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 10
        }
      })
    ),
    children
  ));
};
//# sourceMappingURL=AlpBody.js.map