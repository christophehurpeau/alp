'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsxFileName = 'helmet/Script.jsx';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _fody = require('fody');

var _assetUrl = require('./assetUrl');

var _assetUrl2 = _interopRequireDefault(_assetUrl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const PropsType = _tcombForked2.default.interface({
  src: _tcombForked2.default.String
}, 'PropsType');

const Script = (_ref, _ref2) => {
  var _assert2 = _assert(_ref, PropsType, '{ src, ...props }');

  let src = _assert2.src,
      props = _objectWithoutProperties(_assert2, ['src']);

  let context = _ref2.context;

  _assert({
    src,
    props
  }, PropsType, '{ src, ...props }');

  const version = _assert(context.config.get('version'), _tcombForked2.default.String, 'version');

  return _react2.default.createElement(_fody.Helmet, { script: [_extends({ rel: 'stylesheet', src: (0, _assetUrl2.default)(src, version) }, props)], __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 12
    }
  });
};

Script.contextProps = {
  context: _react.PropTypes.shape({ config: _react.PropTypes.instanceOf(Map) }).isRequired
};

exports.default = Script;

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
//# sourceMappingURL=Script.js.map