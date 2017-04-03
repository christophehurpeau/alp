var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import { PropTypes } from 'react';

const LinkComponent = (_ref, { context: ctx }) => {
  let { tagName: TagName = 'a', to = 'default', params, children } = _ref,
      props = _objectWithoutProperties(_ref, ['tagName', 'to', 'params', 'children']);

  return React.createElement(
    TagName,
    _extends({ href: ctx.urlGenerator(to, params) }, props),
    children
  );
};

LinkComponent.contextTypes = {
  context: PropTypes.shape({
    urlGenerator: PropTypes.func
  })
};

export default LinkComponent;
//# sourceMappingURL=index.js.map