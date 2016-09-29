var _jsxFileName = "LoginFormComponent.jsx";
import React from 'react';

export default function LoginFormComponent() {
    return React.createElement(
        "form",
        { model: "User", action: "/site/login", __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 4
            }
        },
        React.createElement(
            "fieldset",
            { legend: "Login", __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 5
                }
            },
            React.createElement("input", { name: "email", label: "Email", placeholder: "Enter your email", __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 6
                }
            }),
            React.createElement("input", { name: "pwd", __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 7
                }
            }),
            React.createElement("submit", { "container-class": "center", __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 8
                }
            })
        )
    );
}
//# sourceMappingURL=LoginFormComponent.js.map