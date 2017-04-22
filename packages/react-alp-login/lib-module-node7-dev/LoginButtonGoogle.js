var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsxFileName = 'LoginButtonGoogle.jsx',
    _this = this;

import React from 'react';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import Link from 'react-alp-link';
import Button from 'ynnub/components/Button';
import FlatButton from 'ynnub/components/FlatButton';
import GoogleIcon from 'react-icons/lib/fa/google';

import t from 'flow-runtime';
const PropTypes = t.type('PropTypes', t.object(t.property('flat', t.nullable(t.boolean())), t.property('label', t.nullable(t.string()))));


export default (function loginButtonGoogle(_arg) {
  let _PropTypes$assert = PropTypes.assert(_arg),
      { flat, label } = _PropTypes$assert,
      otherProps = _objectWithoutProperties(_PropTypes$assert, ['flat', 'label']);

  return React.createElement(Link, _extends({
    as: flat ? FlatButton : Button,
    to: 'login',
    params: { strategy: 'google' },
    target: '_self',
    icon: React.createElement(GoogleIcon, { className: 'icon', __self: _this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 17
      }
    }),
    label: label || 'Login with Google'
  }, otherProps, {
    __self: _this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 12
    }
  }));
});
//# sourceMappingURL=LoginButtonGoogle.js.map