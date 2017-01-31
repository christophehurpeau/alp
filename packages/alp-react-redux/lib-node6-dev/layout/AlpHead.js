'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsxFileName = 'layout/AlpHead.jsx',
    _arguments = arguments;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _fody = require('fody');

var _types = require('../types');

var _uneval = require('./uneval');

var _uneval2 = _interopRequireDefault(_uneval);

var _assetUrl = require('./assetUrl');

var _assetUrl2 = _interopRequireDefault(_assetUrl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } /* eslint-disable prefer-template */


const PropsType = _tcombForked2.default.interface({
  version: _tcombForked2.default.String,
  moduleIdentifier: _tcombForked2.default.maybe(_tcombForked2.default.String),
  scriptName: _tcombForked2.default.String,
  styleName: _tcombForked2.default.maybe(_tcombForked2.default.String),
  initialData: _tcombForked2.default.maybe(_tcombForked2.default.Any),
  initialBrowserContext: _tcombForked2.default.maybe(_tcombForked2.default.Any)
}, 'PropsType');

exports.default = function alpHead(_ref) {
  let _assert2 = _assert(_ref, PropsType, '{ version, moduleIdentifier, scriptName, styleName, initialData, initialBrowserContext, ...props }'),
      {
    version,
    moduleIdentifier,
    scriptName,
    styleName,
    initialData,
    initialBrowserContext
  } = _assert2,
      props = _objectWithoutProperties(_assert2, ['version', 'moduleIdentifier', 'scriptName', 'styleName', 'initialData', 'initialBrowserContext']);

  _assert({
    version,
    moduleIdentifier,
    scriptName,
    styleName,
    initialData,
    initialBrowserContext,
    props
  }, PropsType, '{ version, moduleIdentifier, scriptName, styleName, initialData, initialBrowserContext, ...props }');

  return _assert(function () {
    return _react2.default.createElement(
      _fody.Head,
      _extends({}, props, {
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 25
        }
      }),
      _react2.default.createElement('meta', { charSet: 'utf-8', __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 26
        }
      }),
      _react2.default.createElement('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1', __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 27
        }
      }),
      _react2.default.createElement('link', { href: 'https://fonts.googleapis.com/css?family=Roboto:400,700,500,300,100,500italic,400italic,700italic', rel: 'stylesheet', type: 'text/css', __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 28
        }
      }),
      _react2.default.createElement('link', { rel: 'stylesheet', href: (0, _assetUrl2.default)(`/${styleName || 'index'}.css`, version), __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 29
        }
      }),
      _react2.default.createElement('link', { rel: 'stylesheet', href: (0, _assetUrl2.default)('/styles.css', version), __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 30
        }
      }),
      _react2.default.createElement('script', { defer: true, src: 'https://polyfill.io/v2/polyfill.min.js?features=default,es6,localStorage,fetch,Intl&unknown=polyfill', __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 31
        }
      }),
      _react2.default.createElement('script', {
        dangerouslySetInnerHTML: {
          __html: `${moduleIdentifier ? `window.MODULE_IDENTIFIER='${moduleIdentifier}';` : ''}` + `window.VERSION='${version}';` + `window.initialData=${(0, _uneval2.default)(initialData)};` + (!initialBrowserContext ? '' : `window.initialBrowserContext=${(0, _uneval2.default)(initialBrowserContext)};`)
        },
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 32
        }
      }),
      _react2.default.createElement('script', { defer: true, src: (0, _assetUrl2.default)(`/${scriptName}.js`, version), __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 43
        }
      })
    );
  }.apply(undefined, _arguments), _types.ReactElementType, 'return value');
};

function _assert(x, type, name) {
  if (_tcombForked2.default.isType(type) && type.meta.kind !== 'struct') {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail('Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')');
  }

  return x;
}
//# sourceMappingURL=AlpHead.js.map