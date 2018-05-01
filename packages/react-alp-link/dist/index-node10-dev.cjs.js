'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var PropTypes = _interopDefault(require('prop-types'));

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

exports.default = LinkComponent;
//# sourceMappingURL=index-node10-dev.cjs.js.map
