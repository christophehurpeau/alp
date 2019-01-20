'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fa = require('react-icons/fa');
var Button = _interopDefault(require('ynnub/components/Button'));

var _jsxFileName = "/Users/chris/Work/alp/alp/packages/react-alp-login/src/LoginButtonGoogle.tsx";
var LoginButtonGoogle = (({
  label = 'Login with Google',
  ...otherProps
}) => React.createElement(Button, Object.assign({
  href: "/login/google",
  icon: React.createElement(fa.FaGoogle, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 15
    },
    __self: void 0
  }),
  label: label
}, otherProps, {
  __source: {
    fileName: _jsxFileName,
    lineNumber: 13
  },
  __self: void 0
})));

var _jsxFileName$1 = "/Users/chris/Work/alp/alp/packages/react-alp-login/src/LoginButtons.tsx";
var LoginButtons = (() => React.createElement("ul", {
  __source: {
    fileName: _jsxFileName$1,
    lineNumber: 5
  },
  __self: void 0
}, React.createElement("li", {
  __source: {
    fileName: _jsxFileName$1,
    lineNumber: 6
  },
  __self: void 0
}, React.createElement(LoginButtonGoogle, {
  __source: {
    fileName: _jsxFileName$1,
    lineNumber: 7
  },
  __self: void 0
}))));

// export { default as LoginForm } from './LoginForm';

exports.LoginButtons = LoginButtons;
//# sourceMappingURL=index-node10-dev.cjs.js.map
