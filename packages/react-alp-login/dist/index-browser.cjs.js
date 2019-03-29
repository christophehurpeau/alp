'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var fa = require('react-icons/fa');
var Button = _interopDefault(require('ynnub/components/Button'));

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var LoginButtonGoogle = (function (_ref) {
  var _ref$label = _ref.label,
      label = _ref$label === void 0 ? 'Login with Google' : _ref$label,
      otherProps = _objectWithoutPropertiesLoose(_ref, ["label"]);

  return React.createElement(Button, Object.assign({
    href: "/login/google",
    icon: React.createElement(fa.FaGoogle, null),
    label: label
  }, otherProps));
});

var LoginButtons = (function () {
  return React.createElement("ul", null, React.createElement("li", null, React.createElement(LoginButtonGoogle, null)));
});

var LoginButtonSlack = (function (_ref) {
  var _ref$label = _ref.label,
      label = _ref$label === void 0 ? 'Login with Slack' : _ref$label,
      otherProps = _objectWithoutPropertiesLoose(_ref, ["label"]);

  return React.createElement(Button, Object.assign({
    href: "/login/slack",
    icon: React.createElement(fa.FaSlack, null),
    label: label
  }, otherProps));
});

// export { default as LoginForm } from './LoginForm';

exports.LoginButtons = LoginButtons;
exports.LoginButtonGoogle = LoginButtonGoogle;
exports.LoginButtonSlack = LoginButtonSlack;
//# sourceMappingURL=index-browser.cjs.js.map
