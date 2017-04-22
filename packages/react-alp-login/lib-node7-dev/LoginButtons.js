'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'LoginButtons.jsx';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _List = require('ynnub/components/List');

var _List2 = _interopRequireDefault(_List);

var _LoginButtonGoogle = require('./LoginButtonGoogle');

var _LoginButtonGoogle2 = _interopRequireDefault(_LoginButtonGoogle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function loginButtons() {
  return _react2.default.createElement(
    _List2.default,
    { links: true, __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 5
      }
    },
    _react2.default.createElement(
      'li',
      {
        __self: undefined,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 6
        }
      },
      _react2.default.createElement(_LoginButtonGoogle2.default, {
        __self: undefined,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 7
        }
      })
    )
  );
};
//# sourceMappingURL=LoginButtons.js.map