var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsxFileName = 'layout/AlpHead.jsx',
    _this = this;

import React from 'react';
import _t from 'tcomb-forked';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/* eslint-disable prefer-template */
import { Head } from 'fody';
import { ReactElementType } from '../types';
import uneval from './uneval';
import assetUrl from './assetUrl';

var PropsType = _t.interface({
  version: _t.String,
  moduleIdentifier: _t.maybe(_t.String),
  scriptName: _t.String,
  styleName: _t.maybe(_t.String),
  initialData: _t.maybe(_t.Any),
  initialBrowserContext: _t.maybe(_t.Any)
}, 'PropsType');

export default (function (_ref) {
  var version = _ref.version,
      moduleIdentifier = _ref.moduleIdentifier,
      scriptName = _ref.scriptName,
      styleName = _ref.styleName,
      initialData = _ref.initialData,
      initialBrowserContext = _ref.initialBrowserContext,
      props = _objectWithoutProperties(_ref, ['version', 'moduleIdentifier', 'scriptName', 'styleName', 'initialData', 'initialBrowserContext']);

  _assert({
    version: version,
    moduleIdentifier: moduleIdentifier,
    scriptName: scriptName,
    styleName: styleName,
    initialData: initialData,
    initialBrowserContext: initialBrowserContext,
    props: props
  }, PropsType, '{ version, moduleIdentifier, scriptName, styleName, initialData, initialBrowserContext, ...props }');

  return _assert(function () {
    return React.createElement(
      Head,
      _extends({}, props, {
        __self: _this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 25
        }
      }),
      React.createElement('meta', { charSet: 'utf-8', __self: _this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 26
        }
      }),
      React.createElement('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1', __self: _this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 27
        }
      }),
      React.createElement('link', { href: 'https://fonts.googleapis.com/css?family=Roboto:400,700,500,300,100,500italic,400italic,700italic', rel: 'stylesheet', type: 'text/css', __self: _this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 28
        }
      }),
      React.createElement('link', { rel: 'stylesheet', href: assetUrl('/' + (styleName || 'index') + '.css', version), __self: _this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 29
        }
      }),
      React.createElement('link', { rel: 'stylesheet', href: assetUrl('/styles.css', version), __self: _this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 30
        }
      }),
      React.createElement('script', { defer: true, src: 'https://polyfill.io/v2/polyfill.min.js?features=default,es6,localStorage,fetch,Intl&unknown=polyfill', __self: _this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 31
        }
      }),
      React.createElement('script', {
        dangerouslySetInnerHTML: {
          __html: '' + (moduleIdentifier ? 'window.MODULE_IDENTIFIER=\'' + moduleIdentifier + '\';' : '') + ('window.VERSION=\'' + version + '\';') + ('window.initialData=' + uneval(initialData) + ';') + (!initialBrowserContext ? '' : 'window.initialBrowserContext=' + uneval(initialBrowserContext) + ';')
        },
        __self: _this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 32
        }
      }),
      React.createElement('script', { defer: true, src: assetUrl('/' + scriptName + '.js', version), __self: _this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 43
        }
      })
    );
  }(), ReactElementType, 'return value');
});

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _t.stringify(x) + ' supplied to ' + name + ' (expected a ' + _t.getTypeName(type) + ')';
  }

  if (_t.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _t.getTypeName(type)]);

      _t.fail(message());
    }
  } else if (!(x instanceof type)) {
    _t.fail(message());
  }

  return x;
}
//# sourceMappingURL=AlpHead.js.map