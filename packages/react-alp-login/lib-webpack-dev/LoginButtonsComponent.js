import React from 'react';
import Link from 'react-alp-link';
import GoogleIcon from 'react-icons/lib/fa/google';

export default function LoginButtonsComponent() {
    return React.createElement(
        'ul',
        { className: 'list links buttons login-buttons', __self: this
        },
        React.createElement(
            'li',
            {
                __self: this
            },
            React.createElement(
                Link,
                {
                    className: 'button flat social-button google-button',
                    to: 'login',
                    params: { strategy: 'google' },
                    target: '_self',
                    __self: this
                },
                React.createElement(GoogleIcon, { className: 'icon', __self: this
                }),
                React.createElement(
                    'span',
                    {
                        __self: this
                    },
                    'Login with Google'
                )
            )
        )
    );
}
//# sourceMappingURL=LoginButtonsComponent.js.map