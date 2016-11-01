var _jsxFileName = 'AlpReactApp.jsx',
    _this = this;

import React from 'react';
import _t from 'tcomb-forked';
/* eslint-disable prefer-template */
/* global window */
import { Helmet, App as DefaultApp } from 'fody';

import assetUrl from './helmet/assetUrl';
import { ReactNodeType, ModuleDescriptorType } from './types';

var PropsType = _t.interface({
  children: ReactNodeType,
  context: _t.Object,
  moduleDescriptor: ModuleDescriptorType,
  scriptName: _t.maybe(_t.String),
  initialData: _t.maybe(_t.Object)
}, 'PropsType');

export default ((_ref) => {
  var children = _ref.children,
      context = _ref.context,
      moduleDescriptor = _ref.moduleDescriptor,
      scriptName = _ref.scriptName,
      initialData = _ref.initialData,
      initialBrowserContext = _ref.initialBrowserContext;

  _assert({
    children,
    context,
    moduleDescriptor,
    scriptName,
    initialData,
    initialBrowserContext
  }, PropsType, '{ children, context, moduleDescriptor, scriptName, initialData, initialBrowserContext }');

  return _assert((() => {
    var version = context.config.get('version');
    var moduleIdentifier = moduleDescriptor && moduleDescriptor.identifier;
    if (!version) throw new Error('Invalid version');

    return React.createElement(
      DefaultApp,
      { context: context, __self: _this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 29
        }
      },
      React.createElement(
        'div',
        { className: 'react-app', __self: _this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 30
          }
        },
        React.createElement(Helmet, {
          meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
          link: [{ rel: 'stylesheet', href: assetUrl('/index.css', version) }, { rel: 'stylesheet', href: assetUrl('/styles.css', version) }],
          script: [{ src: 'https://polyfill.io/v2/polyfill.min.js?features=default,es6,localStorage,fetch,Intl&unknown=polyfill' }, { innerHTML: '' }, { defer: undefined, src: assetUrl(`/${ window.SCRIPT_NAME }.js`, version) }],
          __self: _this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 31
          }
        }),
        children
      )
    );
  })(), ReactNodeType, 'return value');
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
//# sourceMappingURL=AlpReactApp.js.map