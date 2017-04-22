import React from 'react';
import Link from 'react-alp-link';
import GoogleIcon from 'react-icons/lib/fa/google';
import List from 'ynnub/components/List';
import FlatButton from 'ynnub/components/FlatButton';

export default (() => React.createElement(
  List,
  { links: true },
  React.createElement(
    'li',
    null,
    React.createElement(Link, {
      as: FlatButton,
      to: 'login',
      params: { strategy: 'google' },
      target: '_self',
      icon: React.createElement(GoogleIcon, { className: 'icon' }),
      label: 'Login with Google'
    })
  )
));
//# sourceMappingURL=LoginButtonsComponent.js.map