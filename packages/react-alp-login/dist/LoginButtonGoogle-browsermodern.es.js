import { FaGoogle } from 'react-icons/fa';
import Button from 'ynnub/components/Button';

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var LoginButtonGoogle = (function (_ref) {
  let {
    label = 'Login with Google'
  } = _ref,
      otherProps = _objectWithoutPropertiesLoose(_ref, ["label"]);

  return React.createElement(Button, Object.assign({
    href: "/login/google",
    icon: React.createElement(FaGoogle, null),
    label: label
  }, otherProps));
});

export default LoginButtonGoogle;
//# sourceMappingURL=LoginButtonGoogle-browsermodern.es.js.map
