'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Button = require('ynnub/components/Button');

var _Button2 = _interopRequireDefault(_Button);

var _google = require('react-icons/lib/fa/google');

var _google2 = _interopRequireDefault(_google);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const PropsType = _flowRuntime2.default.type('PropsType', _flowRuntime2.default.object(_flowRuntime2.default.property('label', _flowRuntime2.default.nullable(_flowRuntime2.default.string()))));

exports.default = function loginButtonGoogle(_arg) {
  let _PropsType$assert = PropsType.assert(_arg),
      { label } = _PropsType$assert,
      otherProps = _objectWithoutProperties(_PropsType$assert, ['label']);

  return _react2.default.createElement(_Button2.default, _extends({
    href: '/login/google',
    icon: _react2.default.createElement(_google2.default, { className: 'icon' }),
    label: label || 'Login with Google'
  }, otherProps));
};
//# sourceMappingURL=LoginButtonGoogle.js.map