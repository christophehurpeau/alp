import Link from 'react-alp-link/src';
import Button from 'ynnub/components/Button';
import FlatButton from 'ynnub/components/FlatButton';
import GoogleIcon from 'react-icons/lib/fa/google';

type PropTypes = {
  flat: ?boolean,
  label: ?string,
};

export default ({ flat, label, ...otherProps }: PropTypes) => (
  <Link
    as={flat ? FlatButton : Button}
    to="login"
    params={{ strategy: 'google' }}
    target="_self"
    icon={<GoogleIcon className="icon" />}
    label={label || 'Login with Google'}
    {...otherProps}
  />
);
