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
  if (props.tagName) throw new Error('`tagName` is deprecated, use `as` instead');
  return React.createElement(Type, Object.assign({
    href: ctx.urlGenerator(to, params)
  }, props, {
    __source: {
      fileName: "/Users/chris/Work/alp/react-alp-link/src/index.tsx",
      lineNumber: 27
    },
    __self: undefined
  }), children);
};

LinkComponent.contextTypes = {
  context: PropTypes.shape({
    urlGenerator: PropTypes.func
  })
};

export default LinkComponent;
//# sourceMappingURL=index-node8-dev.es.js.map
