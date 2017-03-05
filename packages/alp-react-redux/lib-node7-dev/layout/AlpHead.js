'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsxFileName = 'layout/AlpHead.jsx';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _fody = require('fody');

var _types = require('../types');

var _uneval = require('./uneval');

var _uneval2 = _interopRequireDefault(_uneval);

var _assetUrl = require('./assetUrl');

var _assetUrl2 = _interopRequireDefault(_assetUrl);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } /* eslint-disable prefer-template */


const ReactElementType = _flowRuntime2.default.tdz(() => _types.ReactElementType);

const PropsType = _flowRuntime2.default.type('PropsType', _flowRuntime2.default.object(_flowRuntime2.default.property('version', _flowRuntime2.default.string()), _flowRuntime2.default.property('moduleIdentifier', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.property('scriptName', _flowRuntime2.default.string()), _flowRuntime2.default.property('styleName', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.property('initialData', _flowRuntime2.default.nullable(_flowRuntime2.default.any())), _flowRuntime2.default.property('initialBrowserContext', _flowRuntime2.default.nullable(_flowRuntime2.default.any()))));

exports.default = function alpHead(_ref) {
  let {
    version,
    moduleIdentifier,
    scriptName,
    styleName,
    initialData,
    initialBrowserContext
  } = _ref,
      props = _objectWithoutProperties(_ref, ['version', 'moduleIdentifier', 'scriptName', 'styleName', 'initialData', 'initialBrowserContext']);

  const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.ref(ReactElementType));

  _flowRuntime2.default.param('arguments[0]', PropsType).assert(arguments[0]);

  return _returnType.assert(_react2.default.createElement(
    _fody.Head,
    _extends({}, props, {
      __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 25
      }
    }),
    _react2.default.createElement('meta', { charSet: 'utf-8', __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 26
      }
    }),
    _react2.default.createElement('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1', __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 27
      }
    }),
    _react2.default.createElement('link', { href: 'https://fonts.googleapis.com/css?family=Roboto:400,700,500,300,100,500italic,400italic,700italic', rel: 'stylesheet', type: 'text/css', __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 28
      }
    }),
    _react2.default.createElement('link', { rel: 'stylesheet', href: (0, _assetUrl2.default)(`/${styleName || 'index'}.css`, version), __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 29
      }
    }),
    _react2.default.createElement('link', { rel: 'stylesheet', href: (0, _assetUrl2.default)('/styles.css', version), __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 30
      }
    }),
    _react2.default.createElement('script', { defer: true, src: 'https://polyfill.io/v2/polyfill.min.js?features=default,es6,localStorage,fetch,Intl&unknown=polyfill', __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 31
      }
    }),
    _react2.default.createElement('script', {
      dangerouslySetInnerHTML: {
        __html: `${moduleIdentifier ? `window.MODULE_IDENTIFIER='${moduleIdentifier}';` : ''}` + `window.VERSION='${version}';` + `window.initialData=${(0, _uneval2.default)(initialData)};` + (!initialBrowserContext ? '' : `window.initialBrowserContext=${(0, _uneval2.default)(initialBrowserContext)};`)
      },
      __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 32
      }
    }),
    _react2.default.createElement('script', { defer: true, src: (0, _assetUrl2.default)(`/${scriptName}.js`, version), __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 43
      }
    })
  ));
};
//# sourceMappingURL=AlpHead.js.map