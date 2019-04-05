import React from 'react';
import { FaGoogle, FaSlack } from 'react-icons/fa';
import Button from 'ynnub/components/Button';

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

var _jsxFileName = "/Users/chris/Work/alp/alp/packages/react-alp-login/src/LoginButtonGoogle.tsx";
var LoginButtonGoogle = (function (_ref) {
  var _ref$label = _ref.label,
      label = _ref$label === void 0 ? 'Login with Google' : _ref$label,
      otherProps = _objectWithoutPropertiesLoose(_ref, ["label"]);

  return React.createElement(Button, Object.assign({
    href: "/login/google",
    icon: React.createElement(FaGoogle, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 15
      },
      __self: this
    }),
    label: label
  }, otherProps, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 13
    },
    __self: this
  }));
});

var _jsxFileName$1 = "/Users/chris/Work/alp/alp/packages/react-alp-login/src/LoginButtons.tsx";
var LoginButtons = (function () {
  return React.createElement("ul", {
    __source: {
      fileName: _jsxFileName$1,
      lineNumber: 5
    },
    __self: this
  }, React.createElement("li", {
    __source: {
      fileName: _jsxFileName$1,
      lineNumber: 6
    },
    __self: this
  }, React.createElement(LoginButtonGoogle, {
    __source: {
      fileName: _jsxFileName$1,
      lineNumber: 7
    },
    __self: this
  })));
});

var _jsxFileName$2 = "/Users/chris/Work/alp/alp/packages/react-alp-login/src/LoginButtonSlack.tsx";
var LoginButtonSlack = (function (_ref) {
  var _ref$label = _ref.label,
      label = _ref$label === void 0 ? 'Login with Slack' : _ref$label,
      otherProps = _objectWithoutPropertiesLoose(_ref, ["label"]);

  return React.createElement(Button, Object.assign({
    href: "/login/slack",
    icon: React.createElement(FaSlack, {
      __source: {
        fileName: _jsxFileName$2,
        lineNumber: 15
      },
      __self: this
    }),
    label: label
  }, otherProps, {
    __source: {
      fileName: _jsxFileName$2,
      lineNumber: 13
    },
    __self: this
  }));
});

// export { default as LoginForm } from './LoginForm';

export { LoginButtonGoogle, LoginButtonSlack, LoginButtons };
//# sourceMappingURL=index-browser-dev.es.js.map
