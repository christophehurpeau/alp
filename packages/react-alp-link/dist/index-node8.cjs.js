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
  return React.createElement(Type, Object.assign({
    href: ctx.urlGenerator(to, params)
  }, props), children);
};

LinkComponent.contextTypes = {
  context: PropTypes.shape({
    urlGenerator: PropTypes.func
  })
};

exports.default = LinkComponent;
//# sourceMappingURL=index-node8.cjs.js.map
