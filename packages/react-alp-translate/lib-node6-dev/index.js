'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'index.jsx';
exports.default = TranslateComponent;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

TranslateComponent.propTypes = {
  id: _react.PropTypes.string.isRequired,
  children: _react.PropTypes.func
};

TranslateComponent.contextTypes = {
  context: _react.PropTypes.object.isRequired
};

const Props = _tcombForked2.default.interface({
  id: _tcombForked2.default.String
}, 'Props');

function TranslateComponent(_ref, _ref2) {
  var _assert2 = _assert(_ref, Props, '{ id, children, ...props }');

  let id = _assert2.id;
  let children = _assert2.children;

  let props = _objectWithoutProperties(_assert2, ['id', 'children']);

  let context = _ref2.context;

  _assert({
    id,
    children,
    props
  }, Props, '{ id, children, props }');

  const translated = context.t(id, props);

  if (children) {
    return children(translated);
  }

  return _react2.default.createElement(
    'span',
    {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 26
      }
    },
    translated
  );
}

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')';
  }

  if (_tcombForked2.default.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);

      _tcombForked2.default.fail(message());
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=index.js.map