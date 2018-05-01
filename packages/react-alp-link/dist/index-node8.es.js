import React from 'react';
import PropTypes from 'prop-types';

const LinkComponent = ({
  as: Type = 'a',
  to = 'default',
  params,
  children,
  ...props
}, {
  context: ctx
}) => {
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
//# sourceMappingURL=index-node8.es.js.map
