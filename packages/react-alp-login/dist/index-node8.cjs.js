'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const React = _interopDefault(require('react'));
const fa = require('react-icons/fa');
const Button = _interopDefault(require('ynnub/components/Button'));

const LoginButtonGoogle = (({
  label = 'Login with Google',
  ...otherProps
}) => React.createElement(Button, Object.assign({
  href: "/login/google",
  icon: React.createElement(fa.FaGoogle, null),
  label: label
}, otherProps)));

const LoginButtons = (() => React.createElement("ul", null, React.createElement("li", null, React.createElement(LoginButtonGoogle, null))));

const LoginButtonSlack = (({
  label = 'Login with Slack',
  ...otherProps
}) => React.createElement(Button, Object.assign({
  href: "/login/slack",
  icon: React.createElement(fa.FaSlack, null),
  label: label
}, otherProps)));

// export { default as LoginForm } from './LoginForm';

exports.LoginButtonGoogle = LoginButtonGoogle;
exports.LoginButtonSlack = LoginButtonSlack;
exports.LoginButtons = LoginButtons;
//# sourceMappingURL=index-node8.cjs.js.map
