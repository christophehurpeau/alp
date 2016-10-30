var _jsxFileName = "AlpHelmetHtml.jsx",
    _this = this;

import React from "react";
import { HelmetHtml } from "fody";

export default ((_ref) => {
  var head = _ref.head,
      preBody = _ref.preBody,
      body = _ref.body,
      postBody = _ref.postBody;
  return React.createElement(
    HelmetHtml,
    { head: head, __self: _this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 4
      }
    },
    React.createElement(
      "div",
      { id: "loading-bar", className: "loading-bar", __self: _this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 5
        }
      },
      React.createElement("div", { className: "progress", __self: _this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 5
        }
      })
    ),
    preBody,
    React.createElement("div", { id: "app", dangerouslySetInnerHTML: { __html: body }, __self: _this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 7
      }
    }),
    postBody
  );
});
//# sourceMappingURL=AlpHelmetHtml.js.map