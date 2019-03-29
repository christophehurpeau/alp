import React from 'react';
import { FaGoogle, FaSlack } from 'react-icons/fa';
import Button from 'ynnub/components/Button';

var LoginButtonGoogle = (({
  label = 'Login with Google',
  ...otherProps
}) => React.createElement(Button, Object.assign({
  href: "/login/google",
  icon: React.createElement(FaGoogle, null),
  label: label
}, otherProps)));

var LoginButtons = (() => React.createElement("ul", null, React.createElement("li", null, React.createElement(LoginButtonGoogle, null))));

var LoginButtonSlack = (({
  label = 'Login with Slack',
  ...otherProps
}) => React.createElement(Button, Object.assign({
  href: "/login/slack",
  icon: React.createElement(FaSlack, null),
  label: label
}, otherProps)));

// export { default as LoginForm } from './LoginForm';

export { LoginButtons, LoginButtonGoogle, LoginButtonSlack };
//# sourceMappingURL=index-node10.es.js.map
