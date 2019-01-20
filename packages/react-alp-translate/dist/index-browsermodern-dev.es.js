import { Component } from 'react';
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

class Translate extends Component {
  render() {
    const _this$props = this.props,
          {
      id,
      children
    } = _this$props,
          props = _objectWithoutPropertiesLoose(_this$props, ["id", "children"]);

    const translated = this.context.t(id, props);

    if (children) {
      return children(translated);
    }

    return translated;
  }

}
Translate.contextType = ReactAlpContext;

export default Translate;
//# sourceMappingURL=index-browsermodern-dev.es.js.map
