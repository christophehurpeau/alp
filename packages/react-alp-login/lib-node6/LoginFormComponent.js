"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = () => _react2.default.createElement(
  "form",
  { model: "User", action: "/site/login" },
  _react2.default.createElement(
    "fieldset",
    { legend: "Login" },
    _react2.default.createElement("input", { name: "email", label: "Email", placeholder: "Enter your email" }),
    _react2.default.createElement("input", { name: "pwd" }),
    _react2.default.createElement("submit", {
      "container-class": "center"
    })
  )
);
//# sourceMappingURL=LoginFormComponent.js.map