'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsxFileName = 'index.jsx';
exports.default = LinkComponent;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

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

const PropsType = _tcombForked2.default.interface({
  to: _tcombForked2.default.String,
  params: _tcombForked2.default.maybe(_tcombForked2.default.Object)
}, 'PropsType');

const ContextType = _tcombForked2.default.interface({
  context: _tcombForked2.default.interface({
    urlGenerator: _tcombForked2.default.Function
  })
}, 'ContextType');

function LinkComponent(_ref, _ref2) {
  var _assert3 = _assert(_ref, PropsType, '{ to = \'default\', params, children, ...props }');

  var _assert3$to = _assert3.to;
  let to = _assert3$to === undefined ? 'default' : _assert3$to;
  let params = _assert3.params;
  let children = _assert3.children;

  let props = _objectWithoutProperties(_assert3, ['to', 'params', 'children']);

  var _assert2 = _assert(_ref2, ContextType, '{ context: ctx }');

  let ctx = _assert2.context;

  _assert({
    to,
    params,
    children,
    props
  }, PropsType, '{ to, params, children, props }');

  _assert({
    context: ctx
  }, ContextType, '{ context: ctx }');

  return _react2.default.createElement(
    'a',
    _extends({ href: ctx.urlGenerator(to, params) }, props, {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 30
      }
    }),
    children
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

    return type(x);
  }

  if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=index.js.map