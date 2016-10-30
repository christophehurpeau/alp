"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = "LoginFormComponent.jsx";

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = () => _react2.default.createElement(
  "form",
  { model: "User", action: "/site/login", __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 2
    }
  },
  _react2.default.createElement(
    "fieldset",
    { legend: "Login", __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 3
      }
    },
    _react2.default.createElement("input", { name: "email", label: "Email", placeholder: "Enter your email", __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 4
      }
    }),
    _react2.default.createElement("input", { name: "pwd", __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 5
      }
    }),
    _react2.default.createElement("submit", { "container-class": "center", __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 6
      }
    })
  )
);
//# sourceMappingURL=LoginFormComponent.js.map