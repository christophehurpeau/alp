import React from "react";
import { HelmetHtml } from "fody";

export default (function (_ref) {
  var head = _ref.head,
      preBody = _ref.preBody,
      body = _ref.body,
      postBody = _ref.postBody;
  return React.createElement(
    HelmetHtml,
    { head: head },
    React.createElement(
      "div",
      { id: "loading-bar", className: "loading-bar" },
      React.createElement("div", { className: "progress" })
    ),
    preBody,
    React.createElement("div", { id: "app", dangerouslySetInnerHTML: { __html: body } }),
    postBody
  );
});
//# sourceMappingURL=AlpHelmetHtml.js.map