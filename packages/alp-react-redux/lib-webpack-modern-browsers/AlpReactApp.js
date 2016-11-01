import React from 'react';
/* eslint-disable prefer-template */
import { Helmet, App as DefaultApp } from 'fody';
import uneval from './uneval';
import assetUrl from './helmet/assetUrl';


export default ((_ref) => {
  var children = _ref.children,
      context = _ref.context,
      moduleDescriptor = _ref.moduleDescriptor,
      scriptName = _ref.scriptName,
      initialData = _ref.initialData,
      initialBrowserContext = _ref.initialBrowserContext;

  var version = context.config.get('version');
  var moduleIdentifier = moduleDescriptor && moduleDescriptor.identifier;
  if (!version) throw new Error('Invalid version');

  return React.createElement(
    DefaultApp,
    { context: context },
    React.createElement(
      'div',
      { className: 'react-app' },
      React.createElement(Helmet, {
        meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
        link: [{ rel: 'stylesheet', href: assetUrl('/index.css', version) }, { rel: 'stylesheet', href: assetUrl('/styles.css', version) }],
        script: [{ src: 'https://polyfill.io/v2/polyfill.min.js?features=default,es6,localStorage,fetch,Intl&unknown=polyfill' }, { innerHTML: `${ moduleIdentifier ? `window.MODULE_IDENTIFIER='${ moduleIdentifier }';` : '' }` + `window.VERSION='${ version }';` + `window.initialData=${ uneval(initialData) };` + (!initialBrowserContext ? '' : `window.initialBrowserContext=${ uneval(initialBrowserContext) };`) }, { defer: '', src: assetUrl(`/${ scriptName }.js`, version) }].filter(Boolean)
      }),
      children
    )
  );
});
//# sourceMappingURL=AlpReactApp.js.map