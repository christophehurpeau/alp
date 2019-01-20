'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var ReactAlpContext = _interopDefault(require('react-alp-context'));

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

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

var LinkComponent =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(LinkComponent, _Component);

  function LinkComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = LinkComponent.prototype;

  _proto.render = function render() {
    var _this$props = this.props,
        as = _this$props.as,
        to = _this$props.to,
        params = _this$props.params,
        children = _this$props.children,
        props = _objectWithoutPropertiesLoose(_this$props, ["as", "to", "params", "children"]);

    return React__default.createElement(as, _extends({
      href: this.context.urlGenerator(to, params)
    }, props), children);
  };

  return LinkComponent;
}(React.Component);

LinkComponent.defaultProps = {
  as: 'a',
  to: 'default'
};
LinkComponent.contextType = ReactAlpContext;

exports.default = LinkComponent;
//# sourceMappingURL=index-browser.cjs.js.map
