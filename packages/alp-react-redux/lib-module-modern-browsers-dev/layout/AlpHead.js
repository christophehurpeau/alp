var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsxFileName = 'layout/AlpHead.jsx',
    _this = this;

import React from 'react';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/* eslint-disable prefer-template */
import { Head } from 'fody';
import { ReactElementType as _ReactElementType } from '../types';
import uneval from './uneval';
import assetUrl from './assetUrl';

import t from 'flow-runtime';
const ReactElementType = t.tdz(function () {
  return _ReactElementType;
});
const PropsType = t.type('PropsType', t.object(t.property('version', t.string()), t.property('moduleIdentifier', t.nullable(t.string())), t.property('scriptName', t.string()), t.property('styleName', t.nullable(t.string())), t.property('initialData', t.nullable(t.any())), t.property('initialBrowserContext', t.nullable(t.any()))));


export default (function alpHead(_ref) {
  let {
    version,
    moduleIdentifier,
    scriptName,
    styleName,
    initialData,
    initialBrowserContext
  } = _ref,
      props = _objectWithoutProperties(_ref, ['version', 'moduleIdentifier', 'scriptName', 'styleName', 'initialData', 'initialBrowserContext']);

  const _returnType = t.return(t.ref(ReactElementType));

  t.param('arguments[0]', PropsType).assert(arguments[0]);
  return _returnType.assert(React.createElement(
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
    React.createElement('link', { href: 'https://fonts.googleapis.com/css?family=Roboto:400,700,500,300,400italic', rel: 'stylesheet', type: 'text/css', __self: _this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 28
      }
    }),
    React.createElement('link', { rel: 'stylesheet', href: assetUrl(`/${styleName || 'index'}.css`, version), __self: _this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 29
      }
    }),
    React.createElement('script', { defer: true, src: 'https://polyfill.io/v2/polyfill.min.js?features=default,es6,localStorage,fetch,Intl&unknown=polyfill', __self: _this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 30
      }
    }),
    React.createElement('script', {
      dangerouslySetInnerHTML: {
        __html: `${moduleIdentifier ? `window.MODULE_IDENTIFIER='${moduleIdentifier}';` : ''}` + `window.VERSION='${version}';` + `window.initialData=${uneval(initialData)};` + (!initialBrowserContext ? '' : `window.initialBrowserContext=${uneval(initialBrowserContext)};`)
      },
      __self: _this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 31
      }
    }),
    React.createElement('script', { defer: true, src: assetUrl(`/${scriptName}.js`, version), __self: _this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 42
      }
    })
  ));
});
//# sourceMappingURL=AlpHead.js.map