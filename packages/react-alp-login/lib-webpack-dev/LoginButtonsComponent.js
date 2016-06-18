import React from 'react';
import Link from 'react-alp-link';
import GoogleIcon from 'react-icons/lib/fa/google';

export default function LoginButtonsComponent() {
    return React.createElement(
        'div',
        { className: 'buttons-container login-buttons' },
        React.createElement(
            Link,
            {
                className: 'social-button google-button',
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
    );
}
//# sourceMappingURL=LoginButtonsComponent.js.map