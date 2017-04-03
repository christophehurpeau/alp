'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsxFileName = 'layout/AlpLayout.jsx';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _types = require('fody/types');

var _fody = require('fody');

var _AlpHead = require('./AlpHead');

var _AlpHead2 = _interopRequireDefault(_AlpHead);

var _AlpBody = require('./AlpBody');

var _AlpBody2 = _interopRequireDefault(_AlpBody);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const LayoutPropsType = _flowRuntime2.default.tdz(() => _types.LayoutPropsType);

const ReactElementType = _flowRuntime2.default.tdz(() => _types.ReactElementType);

exports.default = function alpLayout(_arg) {
  const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.ref(ReactElementType));

  let _t$ref$assert = _flowRuntime2.default.ref(LayoutPropsType).assert(_arg),
      { helmet, content } = _t$ref$assert,
      props = _objectWithoutProperties(_t$ref$assert, ['helmet', 'content']);

  return _returnType.assert(_react2.default.createElement(
    _fody.Html,
    { helmet: helmet, __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 7
      }
    },
    _react2.default.createElement(_AlpHead2.default, _extends({ helmet: helmet }, props, {
      __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 8
      }
    })),
    _react2.default.createElement(
      _AlpBody2.default,
      {
        __self: undefined,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 9
        }
      },
      _react2.default.createElement('div', { id: 'app', dangerouslySetInnerHTML: { __html: content }, __self: undefined,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 10
        }
      })
    )
  ));
};
//# sourceMappingURL=AlpLayout.js.map