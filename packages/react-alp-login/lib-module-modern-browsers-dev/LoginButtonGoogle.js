var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import { Element as _Element } from 'react';
import Button from 'ynnub/components/Button';

import t from 'flow-runtime';
const Element = t.tdz(function () {
  return _Element;
});
const PropsType = t.type('PropsType', t.object(t.property('label', t.string(), true)));


export default (function loginButtonGoogle(_arg) {
  const _returnType = t.return(t.ref(Element, t.string('a')));

  let _PropsType$assert = PropsType.assert(_arg),
      { label = 'Login with Google' } = _PropsType$assert,
      otherProps = _objectWithoutProperties(_PropsType$assert, ['label']);

  return _returnType.assert(React.createElement(Button, _extends({ href: '/login/google', icon: 'google', label: label }, otherProps)));
});
//# sourceMappingURL=LoginButtonGoogle.js.map