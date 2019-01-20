import { Component } from 'react';
import ReactAlpContext from 'react-alp-context';

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

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

var Translate =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(Translate, _React$Component);

  function Translate() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = Translate.prototype;

  _proto.render = function render() {
    var _this$props = this.props,
        id = _this$props.id,
        children = _this$props.children,
        props = _objectWithoutPropertiesLoose(_this$props, ["id", "children"]);

    var translated = this.context.t(id, props);

    if (children) {
      return children(translated);
    }

    return translated;
  };

  return Translate;
}(Component);

Translate.contextType = ReactAlpContext;

export default Translate;
//# sourceMappingURL=index-browser.es.js.map
