import Link from 'react-alp-link/src';
import GoogleIcon from 'react-icons/lib/fa/google';
import List from 'ynnub/components/List';
import FlatButton from 'ynnub/components/FlatButton';

export default () => (
  <List links>
    <li>
      <Link
        as={FlatButton}
        to="login"
        params={{ strategy: 'google' }}
        target="_self"
        icon={<GoogleIcon className="icon" />}
        label="Login with Google"
      />
    </li>
  </List>
);
