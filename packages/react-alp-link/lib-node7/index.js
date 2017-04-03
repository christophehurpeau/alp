'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const LinkComponent = (_ref, { context: ctx }) => {
  let { tagName: TagName = 'a', to = 'default', params, children } = _ref,
      props = _objectWithoutProperties(_ref, ['tagName', 'to', 'params', 'children']);

  return _react2.default.createElement(
    TagName,
    _extends({ href: ctx.urlGenerator(to, params) }, props),
    children
  );
};

LinkComponent.contextTypes = {
  context: _react.PropTypes.shape({
    urlGenerator: _react.PropTypes.func
  })
};

exports.default = LinkComponent;
//# sourceMappingURL=index.js.map