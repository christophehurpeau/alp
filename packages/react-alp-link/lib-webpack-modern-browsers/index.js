var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/* eslint-disable react/forbid-prop-types */
import { PropTypes } from 'react';

var LinkComponent = (_ref, _ref2) => {
  var _ref$to = _ref.to,
      to = _ref$to === undefined ? 'default' : _ref$to,
      params = _ref.params,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, ['to', 'params', 'children']);

  var ctx = _ref2.context;
  return React.createElement(
    'a',
    _extends({ href: ctx.urlGenerator(to, params) }, props),
    children
  );
};

LinkComponent.propTypes = {
  to: PropTypes.string.isRequired,
  params: PropTypes.object,
  children: PropTypes.node
};

LinkComponent.contextTypes = {
  context: PropTypes.shape({
    urlGenerator: PropTypes.func
  })
};

export default LinkComponent;
//# sourceMappingURL=index.js.map