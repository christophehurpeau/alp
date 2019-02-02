import React from 'react';
import { FaGoogle } from 'react-icons/fa';
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

var LoginButtonGoogle = (function (_ref) {
  var _ref$label = _ref.label,
      label = _ref$label === void 0 ? 'Login with Google' : _ref$label,
      otherProps = _objectWithoutPropertiesLoose(_ref, ["label"]);

  return React.createElement(Button, Object.assign({
    href: "/login/google",
    icon: React.createElement(FaGoogle, null),
    label: label
  }, otherProps));
});

var LoginButtons = (function () {
  return React.createElement("ul", null, React.createElement("li", null, React.createElement(LoginButtonGoogle, null)));
});

// export { default as LoginForm } from './LoginForm';

export { LoginButtons };
//# sourceMappingURL=index-browser.es.js.map
