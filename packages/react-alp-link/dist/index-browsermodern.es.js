import React from 'react';
import PropTypes from 'prop-types';

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

const LinkComponent = function LinkComponent(_ref, {
  context: ctx
}) {
  let {
    as: Type = 'a',
    to = 'default',
    params,
    children
  } = _ref,
      props = _objectWithoutProperties(_ref, ["as", "to", "params", "children"]);

  return React.createElement(Type, Object.assign({
    href: ctx.urlGenerator(to, params)
  }, props), children);
};

LinkComponent.contextTypes = {
  context: PropTypes.shape({
    urlGenerator: PropTypes.func
  })
};

export default LinkComponent;
//# sourceMappingURL=index-browsermodern.es.js.map
