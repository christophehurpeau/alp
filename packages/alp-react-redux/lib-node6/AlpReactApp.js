'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _fody = require('fody');

var _uneval = require('./uneval');

var _uneval2 = _interopRequireDefault(_uneval);

var _assetUrl = require('./helmet/assetUrl');

var _assetUrl2 = _interopRequireDefault(_assetUrl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (_ref) => {
  let children = _ref.children,
      context = _ref.context,
      moduleDescriptor = _ref.moduleDescriptor,
      scriptName = _ref.scriptName,
      initialData = _ref.initialData,
      initialBrowserContext = _ref.initialBrowserContext;

  const version = context.config.get('version');
  const moduleIdentifier = moduleDescriptor && moduleDescriptor.identifier;
  if (!version) throw new Error('Invalid version');

  return _react2.default.createElement(
    _fody.App,
    { context: context },
    _react2.default.createElement(
      'div',
      { className: 'react-app' },
      _react2.default.createElement(_fody.Helmet, {
        meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
        link: [{ rel: 'stylesheet', href: (0, _assetUrl2.default)('/index.css', version) }, { rel: 'stylesheet', href: (0, _assetUrl2.default)('/styles.css', version) }],
        script: [{ src: 'https://polyfill.io/v2/polyfill.min.js?features=default,es6,localStorage,fetch,Intl&unknown=polyfill' }, { innerHTML: `${ moduleIdentifier ? `window.MODULE_IDENTIFIER='${ moduleIdentifier }';` : '' }` + `window.SCRIPT_NAME='${ scriptName }';` + `window.VERSION='${ version }';` + `window.initialData=${ (0, _uneval2.default)(initialData) };` + (!initialBrowserContext ? '' : `window.initialBrowserContext=${ (0, _uneval2.default)(initialBrowserContext) };`) }, {
          defer: true, // TODO make PR to react-helmet
          src: (0, _assetUrl2.default)(`/${ scriptName }.js`, version)
        }]
      }),
      children
    )
  );
}; /* eslint-disable prefer-template */
/* global window */
//# sourceMappingURL=AlpReactApp.js.map