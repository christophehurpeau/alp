'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _fody = require('fody');

var _uneval = require('./uneval');

var _uneval2 = _interopRequireDefault(_uneval);

var _assetUrl = require('./assetUrl');

var _assetUrl2 = _interopRequireDefault(_assetUrl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } /* eslint-disable prefer-template */


exports.default = (_ref) => {
  let {
    children,
    version,
    moduleIdentifier,
    scriptName,
    styleName,
    initialData,
    initialBrowserContext,
    polyfillFeatures = 'default,es6,es7,localStorage,fetch,Intl'
  } = _ref,
      props = _objectWithoutProperties(_ref, ['children', 'version', 'moduleIdentifier', 'scriptName', 'styleName', 'initialData', 'initialBrowserContext', 'polyfillFeatures']);

  return _react2.default.createElement(
    _fody.Head,
    props,
    _react2.default.createElement('meta', { charSet: 'utf-8' }),
    _react2.default.createElement('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }),
    _react2.default.createElement('link', { rel: 'stylesheet', href: (0, _assetUrl2.default)(`/${styleName || 'index'}.css`, version) }),
    polyfillFeatures && _react2.default.createElement('script', { defer: true, src: `https://polyfill.io/v2/polyfill.min.js?features=${polyfillFeatures}&unknown=polyfill` }),
    scriptName === false ? null : _react2.default.createElement('script', {
      dangerouslySetInnerHTML: {
        __html: `${moduleIdentifier ? `window.MODULE_IDENTIFIER='${moduleIdentifier}';` : ''}` + `window.VERSION='${version}';` + `window.initialData=${(0, _uneval2.default)(initialData)};` + (!initialBrowserContext ? '' : `window.initialBrowserContext=${(0, _uneval2.default)(initialBrowserContext)};`)
      }
    }),
    scriptName === false ? null : _react2.default.createElement('script', { defer: true, src: (0, _assetUrl2.default)(`/${scriptName}.js`, version) }),
    children
  );
};
//# sourceMappingURL=AlpHead.js.map