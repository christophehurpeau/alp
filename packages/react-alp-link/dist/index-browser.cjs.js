'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var PropTypes = _interopDefault(require('prop-types'));

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

var LinkComponent = function LinkComponent(_ref, _ref2) {
  var _ref$as = _ref.as,
      Type = _ref$as === void 0 ? 'a' : _ref$as,
      _ref$to = _ref.to,
      to = _ref$to === void 0 ? 'default' : _ref$to,
      params = _ref.params,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, ["as", "to", "params", "children"]);

  var ctx = _ref2.context;
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
//# sourceMappingURL=index-browser.cjs.js.map
