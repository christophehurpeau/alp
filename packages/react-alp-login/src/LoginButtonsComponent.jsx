import Link from 'react-alp-link/src';
import GoogleIcon from 'react-icons/lib/fa/google';

export default () => (
  <ul className="list links buttons login-buttons">
    <li>
      <Link
        className="button flat social-button google-button"
        to="login"
        params={{ strategy: 'google' }}
        target="_self"
      >
        <GoogleIcon className="icon" />
        <span>Login with Google</span>
      </Link>
    </li>
  </ul>
);
