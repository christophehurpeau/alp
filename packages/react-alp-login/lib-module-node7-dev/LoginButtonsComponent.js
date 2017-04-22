var _jsxFileName = 'LoginButtonsComponent.jsx',
    _this = this;

import React from 'react';
import Link from 'react-alp-link';
import GoogleIcon from 'react-icons/lib/fa/google';
import List from 'ynnub/components/List';
import FlatButton from 'ynnub/components/FlatButton';

export default (function loginButtonsComponent() {
  return React.createElement(
    List,
    { links: true, __self: _this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 7
      }
    },
    React.createElement(
      'li',
      {
        __self: _this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 8
        }
      },
      React.createElement(Link, {
        as: FlatButton,
        to: 'login',
        params: { strategy: 'google' },
        target: '_self',
        icon: React.createElement(GoogleIcon, { className: 'icon', __self: _this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 14
          }
        }),
        label: 'Login with Google',
        __self: _this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 9
        }
      })
    )
  );
});
//# sourceMappingURL=LoginButtonsComponent.js.map