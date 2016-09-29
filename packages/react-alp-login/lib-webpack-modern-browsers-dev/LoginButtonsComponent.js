var _jsxFileName = 'LoginButtonsComponent.jsx';
import React from 'react';
import Link from 'react-alp-link';
import GoogleIcon from 'react-icons/lib/fa/google';

export default function LoginButtonsComponent() {
    return React.createElement(
        'ul',
        { className: 'list links buttons login-buttons', __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 6
            }
        },
        React.createElement(
            'li',
            {
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 7
                }
            },
            React.createElement(
                Link,
                {
                    className: 'button flat social-button google-button',
                    to: 'login',
                    params: { strategy: 'google' },
                    target: '_self',
                    __self: this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 8
                    }
                },
                React.createElement(GoogleIcon, { className: 'icon', __self: this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 14
                    }
                }),
                React.createElement(
                    'span',
                    {
                        __self: this,
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 15
                        }
                    },
                    'Login with Google'
                )
            )
        )
    );
}
//# sourceMappingURL=LoginButtonsComponent.js.map