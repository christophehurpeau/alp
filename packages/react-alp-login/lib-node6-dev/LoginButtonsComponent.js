'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'LoginButtonsComponent.jsx';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAlpLink = require('react-alp-link');

var _reactAlpLink2 = _interopRequireDefault(_reactAlpLink);

var _google = require('react-icons/lib/fa/google');

var _google2 = _interopRequireDefault(_google);

var _List = require('ynnub/components/List');

var _List2 = _interopRequireDefault(_List);

var _FlatButton = require('ynnub/components/FlatButton');

var _FlatButton2 = _interopRequireDefault(_FlatButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function loginButtonsComponent() {
  return _react2.default.createElement(
    _List2.default,
    { links: true, __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 7
      }
    },
    _react2.default.createElement(
      'li',
      {
        __self: undefined,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 8
        }
      },
      _react2.default.createElement(
        _reactAlpLink2.default,
        {
          as: _FlatButton2.default,
          to: 'login',
          params: { strategy: 'google' },
          target: '_self',
          __self: undefined,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 9
          }
        },
        _react2.default.createElement(_google2.default, { className: 'icon', __self: undefined,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 15
          }
        }),
        ' ',
        _react2.default.createElement(
          'span',
          {
            __self: undefined,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 17
            }
          },
          'Login with Google'
        )
      )
    )
  );
};
//# sourceMappingURL=LoginButtonsComponent.js.map