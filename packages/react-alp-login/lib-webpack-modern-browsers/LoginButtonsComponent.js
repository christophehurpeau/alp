import React from 'react';
import Link from 'react-alp-link';
import GoogleIcon from 'react-icons/lib/fa/google';

export default (() => React.createElement(
  'ul',
  { className: 'list links buttons login-buttons' },
  React.createElement(
    'li',
    null,
    React.createElement(
      Link,
      {
        className: 'button flat social-button google-button',
        to: 'login',
        params: { strategy: 'google' },
        target: '_self'
      },
      React.createElement(GoogleIcon, { className: 'icon' }),
      React.createElement(
        'span',
        null,
        'Login with Google'
      )
    )
  )
));
//# sourceMappingURL=LoginButtonsComponent.js.map