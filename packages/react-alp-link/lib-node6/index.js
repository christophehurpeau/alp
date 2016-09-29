'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = LinkComponent;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

LinkComponent.propTypes = {
  to: _react.PropTypes.string,
  params: _react.PropTypes.object,
  children: _react.PropTypes.node
};

LinkComponent.contextTypes = {
  context: _react.PropTypes.shape({
    urlGenerator: _react.PropTypes.func
  })
};

function LinkComponent(_ref, _ref2) {
  var _ref$to = _ref.to;
  let to = _ref$to === undefined ? 'default' : _ref$to;
  let params = _ref.params;
  let children = _ref.children;

  let props = _objectWithoutProperties(_ref, ['to', 'params', 'children']);

  let ctx = _ref2.context;

  return _react2.default.createElement(
    'a',
    _extends({ href: ctx.urlGenerator(to, params) }, props),
    children
  );
}
//# sourceMappingURL=index.js.map