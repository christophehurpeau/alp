"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = "AlpHelmetHtml.jsx";

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _fody = require("fody");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (_ref) => {
  let head = _ref.head,
      preBody = _ref.preBody,
      body = _ref.body,
      postBody = _ref.postBody;
  return _react2.default.createElement(
    _fody.HelmetHtml,
    { head: head, __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 4
      }
    },
    _react2.default.createElement(
      "div",
      { id: "loading-bar", className: "loading-bar", __self: undefined,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 5
        }
      },
      _react2.default.createElement("div", { className: "progress", __self: undefined,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 5
        }
      })
    ),
    preBody,
    _react2.default.createElement("div", { id: "app", dangerouslySetInnerHTML: { __html: body }, __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 7
      }
    }),
    postBody
  );
};
//# sourceMappingURL=AlpHelmetHtml.js.map