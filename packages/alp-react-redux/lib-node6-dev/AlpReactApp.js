'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'AlpReactApp.jsx'; /* eslint-disable prefer-template */
/* global window */

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _fody = require('fody');

var _uneval = require('./uneval');

var _uneval2 = _interopRequireDefault(_uneval);

var _assetUrl = require('./helmet/assetUrl');

var _assetUrl2 = _interopRequireDefault(_assetUrl);

var _types = require('./types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PropsType = _tcombForked2.default.interface({
  children: _types.ReactNodeType,
  context: _tcombForked2.default.Object,
  moduleDescriptor: _types.ModuleDescriptorType,
  scriptName: _tcombForked2.default.maybe(_tcombForked2.default.String),
  initialData: _tcombForked2.default.maybe(_tcombForked2.default.Object)
}, 'PropsType');

exports.default = (_ref) => {
  var _assert2 = _assert(_ref, PropsType, '{ children, context, moduleDescriptor, scriptName, initialData, initialBrowserContext }');

  let children = _assert2.children,
      context = _assert2.context,
      moduleDescriptor = _assert2.moduleDescriptor,
      scriptName = _assert2.scriptName,
      initialData = _assert2.initialData,
      initialBrowserContext = _assert2.initialBrowserContext;

  _assert({
    children,
    context,
    moduleDescriptor,
    scriptName,
    initialData,
    initialBrowserContext
  }, PropsType, '{ children, context, moduleDescriptor, scriptName, initialData, initialBrowserContext }');

  return _assert((() => {
    const version = _assert(context.config.get('version'), _tcombForked2.default.String, 'version');
    const moduleIdentifier = _assert(moduleDescriptor && moduleDescriptor.identifier, _tcombForked2.default.maybe(_tcombForked2.default.String), 'moduleIdentifier');
    if (!version) throw new Error('Invalid version');

    return _react2.default.createElement(
      _fody.App,
      { context: context, __self: undefined,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 29
        }
      },
      _react2.default.createElement(
        'div',
        { className: 'react-app', __self: undefined,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 30
          }
        },
        _react2.default.createElement(_fody.Helmet, {
          meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
          link: [{ rel: 'stylesheet', href: (0, _assetUrl2.default)('/index.css', version) }, { rel: 'stylesheet', href: (0, _assetUrl2.default)('/styles.css', version) }],
          script: [{ src: 'https://polyfill.io/v2/polyfill.min.js?features=default,es6,localStorage,fetch,Intl&unknown=polyfill' }, { innerHTML: `${ moduleIdentifier ? `window.MODULE_IDENTIFIER='${ moduleIdentifier }';` : '' }` + `window.SCRIPT_NAME='${ scriptName }';` + `window.VERSION='${ version }';` + `window.initialData=${ (0, _uneval2.default)(initialData) };` + (!initialBrowserContext ? '' : `window.initialBrowserContext=${ (0, _uneval2.default)(initialBrowserContext) };`) }, { defer: '', src: (0, _assetUrl2.default)(`/${ scriptName }.js`, version) }].filter(Boolean),
          __self: undefined,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 31
          }
        }),
        children
      )
    );
  })(), _types.ReactNodeType, 'return value');
};

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
//# sourceMappingURL=AlpReactApp.js.map