'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const TranslateComponent = (_ref, { context }) => {
  let { id, children } = _ref,
      props = _objectWithoutProperties(_ref, ['id', 'children']);

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

TranslateComponent.contextTypes = {
  context: _react.PropTypes.object.isRequired
};

exports.default = TranslateComponent;
//# sourceMappingURL=index.js.map