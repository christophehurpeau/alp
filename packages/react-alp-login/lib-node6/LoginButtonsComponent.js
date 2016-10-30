'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAlpLink = require('react-alp-link');

var _reactAlpLink2 = _interopRequireDefault(_reactAlpLink);

var _google = require('react-icons/lib/fa/google');

var _google2 = _interopRequireDefault(_google);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = () => _react2.default.createElement(
  'ul',
  { className: 'list links buttons login-buttons' },
  _react2.default.createElement(
    'li',
    null,
    _react2.default.createElement(
      _reactAlpLink2.default,
      {
        className: 'button flat social-button google-button',
        to: 'login',
        params: { strategy: 'google' },
        target: '_self'
      },
      _react2.default.createElement(_google2.default, { className: 'icon' }),
      _react2.default.createElement(
        'span',
        null,
        'Login with Google'
      )
    )
  )
);
//# sourceMappingURL=LoginButtonsComponent.js.map