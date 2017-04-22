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

var _List = require('ynnub/components/List');

var _List2 = _interopRequireDefault(_List);

var _FlatButton = require('ynnub/components/FlatButton');

var _FlatButton2 = _interopRequireDefault(_FlatButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = () => _react2.default.createElement(
  _List2.default,
  { links: true },
  _react2.default.createElement(
    'li',
    null,
    _react2.default.createElement(_reactAlpLink2.default, {
      as: _FlatButton2.default,
      to: 'login',
      params: { strategy: 'google' },
      target: '_self',
      icon: _react2.default.createElement(_google2.default, { className: 'icon' }),
      label: 'Login with Google'
    })
  )
);
//# sourceMappingURL=LoginButtonsComponent.js.map