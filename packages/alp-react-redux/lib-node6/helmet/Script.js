'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _fody = require('fody');

var _assetUrl = require('./assetUrl');

var _assetUrl2 = _interopRequireDefault(_assetUrl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const Script = (_ref, _ref2) => {
  let src = _ref.src,
      props = _objectWithoutProperties(_ref, ['src']);

  let context = _ref2.context;

  const version = context.config.get('version');

  return _react2.default.createElement(_fody.Helmet, { script: [_extends({ rel: 'stylesheet', src: (0, _assetUrl2.default)(src, version) }, props)] });
};

Script.contextProps = {
  context: _react.PropTypes.shape({ config: _react.PropTypes.instanceOf(Map) }).isRequired
};

exports.default = Script;
//# sourceMappingURL=Script.js.map