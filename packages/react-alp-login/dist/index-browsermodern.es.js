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

const LoginButtonGoogle = (function (_ref) {
  let {
    label = 'Login with Google'
  } = _ref,
      otherProps = _objectWithoutPropertiesLoose(_ref, ["label"]);

  return React.createElement(Button, Object.assign({
    href: "/login/google",
    icon: React.createElement(FaGoogle, null),
    label: label
  }, otherProps));
});

const LoginButtons = (function () {
  return React.createElement("ul", null, React.createElement("li", null, React.createElement(LoginButtonGoogle, null)));
});

const LoginButtonSlack = (function (_ref) {
  let {
    label = 'Login with Slack'
  } = _ref,
      otherProps = _objectWithoutPropertiesLoose(_ref, ["label"]);

  return React.createElement(Button, Object.assign({
    href: "/login/slack",
    icon: React.createElement(FaSlack, null),
    label: label
  }, otherProps));
});

// export { default as LoginForm } from './LoginForm';

export { LoginButtonGoogle, LoginButtonSlack, LoginButtons };
//# sourceMappingURL=index-browsermodern.es.js.map
