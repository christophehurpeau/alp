import React from 'react';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import { Body } from 'fody';


export default (function (_ref) {
  var children = _ref.children,
      props = _objectWithoutProperties(_ref, ['children']);

  return React.createElement(
    Body,
    props,
    React.createElement(
      'div',
      { id: 'loading-bar', className: 'loading-bar' },
      React.createElement('div', { className: 'progress' })
    ),
    children
  );
});
//# sourceMappingURL=AlpBody.js.map