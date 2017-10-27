var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import 'react';
import Button from 'ynnub/components/Button';

export default ((_ref) => {
  let { label = 'Login with Google' } = _ref,
      otherProps = _objectWithoutProperties(_ref, ['label']);

  return React.createElement(Button, _extends({ href: '/login/google', icon: 'google', label: label }, otherProps));
});
//# sourceMappingURL=LoginButtonGoogle.js.map