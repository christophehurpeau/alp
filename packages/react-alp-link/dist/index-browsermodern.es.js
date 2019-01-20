import React, { Component } from 'react';
import ReactAlpContext from 'react-alp-context';

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

class LinkComponent extends Component {
  render() {
    const _this$props = this.props,
          {
      as,
      to,
      params,
      children
    } = _this$props,
          props = _objectWithoutPropertiesLoose(_this$props, ["as", "to", "params", "children"]);

    return React.createElement(as, Object.assign({
      href: this.context.urlGenerator(to, params)
    }, props), children);
  }

}
LinkComponent.defaultProps = {
  as: 'a',
  to: 'default'
};
LinkComponent.contextType = ReactAlpContext;

export default LinkComponent;
//# sourceMappingURL=index-browsermodern.es.js.map
