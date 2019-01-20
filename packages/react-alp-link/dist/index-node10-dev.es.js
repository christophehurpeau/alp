import React, { Component } from 'react';
import ReactAlpContext from 'react-alp-context';

class LinkComponent extends Component {
  render() {
    const {
      as,
      to,
      params,
      children,
      ...props
    } = this.props;

    if (props.tagName) {
      throw new Error('`tagName` is deprecated, use `as` instead');
    }

    return React.createElement(as, {
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

export default LinkComponent;
//# sourceMappingURL=index-node10-dev.es.js.map
