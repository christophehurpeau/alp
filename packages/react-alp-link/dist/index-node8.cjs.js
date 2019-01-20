'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var ReactAlpContext = _interopDefault(require('react-alp-context'));

class LinkComponent extends React.Component {
  render() {
    const {
      as,
      to,
      params,
      children,
      ...props
    } = this.props;
    return React__default.createElement(as, {
      href: this.context.urlGenerator(to, params),
      ...props
    }, children);
  }

}
LinkComponent.defaultProps = {
  as: 'a',
  to: 'default'
};
LinkComponent.contextType = ReactAlpContext;

exports.default = LinkComponent;
//# sourceMappingURL=index-node8.cjs.js.map
