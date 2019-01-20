import { FaGoogle } from 'react-icons/fa';
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

// export { default as LoginForm } from './LoginForm';

export { LoginButtons };
//# sourceMappingURL=index-node10.es.js.map
