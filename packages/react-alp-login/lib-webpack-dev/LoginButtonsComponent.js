var _jsxFileName = 'LoginButtonsComponent.jsx',
    _this = this;

import React from 'react';
import Link from 'react-alp-link';
import GoogleIcon from 'react-icons/lib/fa/google';

export default (function () {
  return React.createElement(
    'ul',
    { className: 'list links buttons login-buttons', __self: _this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 5
      }
    },
    React.createElement(
      'li',
      {
        __self: _this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 6
        }
      },
      React.createElement(
        Link,
        {
          className: 'button flat social-button google-button',
          to: 'login',
          params: { strategy: 'google' },
          target: '_self',
          __self: _this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 7
          }
        },
        React.createElement(GoogleIcon, { className: 'icon', __self: _this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 13
          }
        }),
        React.createElement(
          'span',
          {
            __self: _this,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 14
            }
          },
          'Login with Google'
        )
      )
    )
  );
});
//# sourceMappingURL=LoginButtonsComponent.js.map