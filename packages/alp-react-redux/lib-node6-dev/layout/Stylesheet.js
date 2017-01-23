'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsxFileName = 'layout/Stylesheet.jsx';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _assetUrl = require('./assetUrl');

var _assetUrl2 = _interopRequireDefault(_assetUrl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const PropsType = _tcombForked2.default.interface({
  href: _tcombForked2.default.String
}, 'PropsType');

const ContextType = _tcombForked2.default.interface({
  context: _tcombForked2.default.interface({
    config: Map
  })
}, 'ContextType');

exports.default = function stylesheet(_ref, { context }) {
  let { href } = _assert(_ref, PropsType, '{ href, ...props }');

  let props = _objectWithoutProperties(_assert(_ref, PropsType, '{ href, ...props }'), ['href']);

  _assert({
    href,
    props
  }, PropsType, '{ href, ...props }');

  _assert({
    context
  }, ContextType, '{ context }');

  const version = _assert(context.config.get('version'), _tcombForked2.default.String, 'version');

  return _react2.default.createElement('link', _extends({ rel: 'stylesheet', href: (0, _assetUrl2.default)(href, version) }, props, {
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 16
    }
  }));
};

function _assert(x, type, name) {
  if (false) {
    _tcombForked2.default.fail = function (message) {
      console.warn(message);
    };
  }

  if (_tcombForked2.default.isType(type) && type.meta.kind !== 'struct') {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail('Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')');
  }

  return x;
}
//# sourceMappingURL=Stylesheet.js.map