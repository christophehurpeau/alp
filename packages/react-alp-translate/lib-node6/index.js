'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const TranslateComponent = (_ref, _ref2) => {
  let id = _ref.id,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, ['id', 'children']);

  let context = _ref2.context;

  const translated = context.t(id, props);

  if (children) {
    return children(translated);
  }

  return _react2.default.createElement(
    'span',
    null,
    translated
  );
};

TranslateComponent.propTypes = {
  id: _react.PropTypes.string.isRequired,
  children: _react.PropTypes.func
};

TranslateComponent.contextTypes = {
  context: _react.PropTypes.object.isRequired
};

exports.default = TranslateComponent;
//# sourceMappingURL=index.js.map