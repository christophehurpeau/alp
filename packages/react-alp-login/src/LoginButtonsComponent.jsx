import React from 'react';
import Link from 'react-alp-link';
import GoogleIcon from 'react-icons/lib/fa/google';

export default function LoginButtonsComponent() {
    return (<div className="buttons-container login-buttons">
        <Link
            className="social-button google-button"
            to="login"
            params={{ strategy: 'google' }}
            target="_self"
        >
            <GoogleIcon className="icon" />
            <span>Login with Google</span>
        </Link>
    </div>);
}
