'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var fa = require('react-icons/fa');
var Button = _interopDefault(require('ynnub/components/Button'));

var LoginButtonGoogle = (({
  label = 'Login with Google',
  ...otherProps
}) => React.createElement(Button, Object.assign({
  href: "/login/google",
  icon: React.createElement(fa.FaGoogle, null),
  label: label
}, otherProps)));

var LoginButtons = (() => React.createElement("ul", null, React.createElement("li", null, React.createElement(LoginButtonGoogle, null))));

var LoginButtonSlack = (({
  label = 'Login with Slack',
  ...otherProps
}) => React.createElement(Button, Object.assign({
  href: "/login/slack",
  icon: React.createElement(fa.FaSlack, null),
  label: label
}, otherProps)));

// export { default as LoginForm } from './LoginForm';

exports.LoginButtons = LoginButtons;
exports.LoginButtonGoogle = LoginButtonGoogle;
exports.LoginButtonSlack = LoginButtonSlack;
//# sourceMappingURL=index-node8.cjs.js.map
