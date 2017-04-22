'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsxFileName = 'LoginButtonGoogle.jsx';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAlpLink = require('react-alp-link');

var _reactAlpLink2 = _interopRequireDefault(_reactAlpLink);

var _Button = require('ynnub/components/Button');

var _Button2 = _interopRequireDefault(_Button);

var _FlatButton = require('ynnub/components/FlatButton');

var _FlatButton2 = _interopRequireDefault(_FlatButton);

var _google = require('react-icons/lib/fa/google');

var _google2 = _interopRequireDefault(_google);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const PropTypes = _flowRuntime2.default.type('PropTypes', _flowRuntime2.default.object(_flowRuntime2.default.property('flat', _flowRuntime2.default.nullable(_flowRuntime2.default.boolean())), _flowRuntime2.default.property('label', _flowRuntime2.default.nullable(_flowRuntime2.default.string()))));

exports.default = function loginButtonGoogle(_arg) {
  let _PropTypes$assert = PropTypes.assert(_arg),
      { flat, label } = _PropTypes$assert,
      otherProps = _objectWithoutProperties(_PropTypes$assert, ['flat', 'label']);

  return _react2.default.createElement(_reactAlpLink2.default, _extends({
    as: flat ? _FlatButton2.default : _Button2.default,
    to: 'login',
    params: { strategy: 'google' },
    target: '_self',
    icon: _react2.default.createElement(_google2.default, { className: 'icon', __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 17
      }
    }),
    label: label || 'Login with Google'
  }, otherProps, {
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 12
    }
  }));
};
//# sourceMappingURL=LoginButtonGoogle.js.map