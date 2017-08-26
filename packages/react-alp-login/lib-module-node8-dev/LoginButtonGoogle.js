var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import Button from 'ynnub/components/Button';
import GoogleIcon from 'react-icons/lib/fa/google';

import t from 'flow-runtime';
const PropsType = t.type('PropsType', t.object(t.property('label', t.nullable(t.string()))));


export default (function loginButtonGoogle(_arg) {
  let _PropsType$assert = PropsType.assert(_arg),
      { label } = _PropsType$assert,
      otherProps = _objectWithoutProperties(_PropsType$assert, ['label']);

  return React.createElement(Button, _extends({
    href: '/login/google',
    icon: React.createElement(GoogleIcon, { className: 'icon' }),
    label: label || 'Login with Google'
  }, otherProps));
});
//# sourceMappingURL=LoginButtonGoogle.js.map