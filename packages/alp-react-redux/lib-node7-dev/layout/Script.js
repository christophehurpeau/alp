'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsxFileName = 'layout/Script.jsx';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _assetUrl = require('./assetUrl');

var _assetUrl2 = _interopRequireDefault(_assetUrl);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const PropsType = _flowRuntime2.default.type('PropsType', _flowRuntime2.default.object(_flowRuntime2.default.property('src', _flowRuntime2.default.string())));

const ContextType = _flowRuntime2.default.type('ContextType', _flowRuntime2.default.object(_flowRuntime2.default.property('context', _flowRuntime2.default.object(_flowRuntime2.default.property('config', _flowRuntime2.default.ref('Map', _flowRuntime2.default.string(), _flowRuntime2.default.any()))))));

exports.default = function script(_ref, { context }) {
  let { src } = _ref,
      props = _objectWithoutProperties(_ref, ['src']);

  _flowRuntime2.default.param('arguments[0]', PropsType).assert(arguments[0]);

  _flowRuntime2.default.param('arguments[1]', ContextType).assert(arguments[1]);

  const version = _flowRuntime2.default.string().assert(context.config.get('version'));

  return _react2.default.createElement('script', _extends({ src: (0, _assetUrl2.default)(src, version) }, props, {
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 16
    }
  }));
};
//# sourceMappingURL=Script.js.map