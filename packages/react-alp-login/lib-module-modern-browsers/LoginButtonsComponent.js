import React from 'react';
import Link from 'react-alp-link';
import GoogleIcon from 'react-icons/lib/fa/google';
import List from 'ynnub/components/List';
import FlatButton from 'ynnub/components/FlatButton';

export default (function () {
  return React.createElement(
    List,
    { links: true },
    React.createElement(
      'li',
      null,
      React.createElement(
        Link,
        {
          tagName: FlatButton,
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
  );
});
//# sourceMappingURL=LoginButtonsComponent.js.map