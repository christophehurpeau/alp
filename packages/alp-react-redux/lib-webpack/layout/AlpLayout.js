var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import { Html } from 'fody';
import AlpHead from './AlpHead';
import AlpBody from './AlpBody';

export default (function (_ref) {
  var helmet = _ref.helmet,
      content = _ref.content,
      props = _objectWithoutProperties(_ref, ['helmet', 'content']);

  return React.createElement(
    Html,
    { helmet: helmet },
    React.createElement(AlpHead, _extends({ helmet: helmet }, props)),
    React.createElement(
      AlpBody,
      null,
      React.createElement('div', { id: 'app', dangerouslySetInnerHTML: { __html: content } })
    )
  );
});
//# sourceMappingURL=AlpLayout.js.map