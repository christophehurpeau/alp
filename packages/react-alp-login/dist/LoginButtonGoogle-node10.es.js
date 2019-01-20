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

export default LoginButtonGoogle;
//# sourceMappingURL=LoginButtonGoogle-node10.es.js.map
