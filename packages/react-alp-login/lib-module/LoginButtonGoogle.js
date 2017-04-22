var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import Link from 'react-alp-link';
import Button from 'ynnub/components/Button';
import FlatButton from 'ynnub/components/FlatButton';
import GoogleIcon from 'react-icons/lib/fa/google';

export default (function (_ref) {
  var flat = _ref.flat,
      label = _ref.label,
      otherProps = _objectWithoutProperties(_ref, ['flat', 'label']);

  return React.createElement(Link, _extends({
    as: flat ? FlatButton : Button,
    to: 'login',
    params: { strategy: 'google' },
    target: '_self',
    icon: React.createElement(GoogleIcon, { className: 'icon' }),
    label: label || 'Login with Google'
  }, otherProps));
});
//# sourceMappingURL=LoginButtonGoogle.js.map