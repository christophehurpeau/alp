import React from 'react';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/* eslint-disable prefer-template */
import { Head } from 'fody';

import uneval from './uneval';
import assetUrl from './assetUrl';

export default ((_ref) => {
  let {
    version,
    moduleIdentifier,
    scriptName,
    styleName,
    initialData,
    initialBrowserContext
  } = _ref,
      props = _objectWithoutProperties(_ref, ['version', 'moduleIdentifier', 'scriptName', 'styleName', 'initialData', 'initialBrowserContext']);

  return React.createElement(
    Head,
    props,
    React.createElement('meta', { charSet: 'utf-8' }),
    React.createElement('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }),
    React.createElement('link', { href: 'https://fonts.googleapis.com/css?family=Roboto:400,700,500,300,400italic', rel: 'stylesheet', type: 'text/css' }),
    React.createElement('link', { rel: 'stylesheet', href: assetUrl(`/${styleName || 'index'}.css`, version) }),
    React.createElement('script', { defer: true, src: 'https://polyfill.io/v2/polyfill.min.js?features=default,es6,localStorage,fetch,Intl&unknown=polyfill' }),
    scriptName === false ? null : React.createElement('script', {
      dangerouslySetInnerHTML: {
        __html: `${moduleIdentifier ? `window.MODULE_IDENTIFIER='${moduleIdentifier}';` : ''}` + `window.VERSION='${version}';` + `window.initialData=${uneval(initialData)};` + (!initialBrowserContext ? '' : `window.initialBrowserContext=${uneval(initialBrowserContext)};`)
      }
    }),
    scriptName === false ? null : React.createElement('script', { defer: true, src: assetUrl(`/${scriptName}.js`, version) })
  );
});
//# sourceMappingURL=AlpHead.js.map