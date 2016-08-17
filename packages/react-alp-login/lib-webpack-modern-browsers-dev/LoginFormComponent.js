import React from 'react';

export default function LoginFormComponent() {
    return React.createElement(
        "form",
        { model: "User", action: "/site/login", __self: this
        },
        React.createElement(
            "fieldset",
            { legend: "Login", __self: this
            },
            React.createElement("input", { name: "email", label: "Email", placeholder: "Enter your email", __self: this
            }),
            React.createElement("input", { name: "pwd", __self: this
            }),
            React.createElement("submit", { "container-class": "center", __self: this
            })
        )
    );
}
//# sourceMappingURL=LoginFormComponent.js.map