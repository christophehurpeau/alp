var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import PropTypes from 'prop-types';


var LinkComponent = function LinkComponent(_ref, _ref2) {
  var ctx = _ref2.context;

  var _ref$as = _ref.as,
      Type = _ref$as === undefined ? 'a' : _ref$as,
      _ref$to = _ref.to,
      to = _ref$to === undefined ? 'default' : _ref$to,
      params = _ref.params,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, ['as', 'to', 'params', 'children']);

  return React.createElement(
    Type,
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