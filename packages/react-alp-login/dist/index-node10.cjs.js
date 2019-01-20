'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

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

// export { default as LoginForm } from './LoginForm';

exports.LoginButtons = LoginButtons;
//# sourceMappingURL=index-node10.cjs.js.map
