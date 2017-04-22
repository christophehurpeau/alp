import React from 'react';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/* eslint-disable prefer-template */
import { Head } from 'fody';

import uneval from './uneval';
import assetUrl from './assetUrl';

export default (function (_ref) {
  var children = _ref.children,
      version = _ref.version,
      moduleIdentifier = _ref.moduleIdentifier,
      scriptName = _ref.scriptName,
      styleName = _ref.styleName,
      initialData = _ref.initialData,
      initialBrowserContext = _ref.initialBrowserContext,
      _ref$polyfillFeatures = _ref.polyfillFeatures,
      polyfillFeatures = _ref$polyfillFeatures === undefined ? 'default,es6,es7,localStorage,fetch,Intl' : _ref$polyfillFeatures,
      props = _objectWithoutProperties(_ref, ['children', 'version', 'moduleIdentifier', 'scriptName', 'styleName', 'initialData', 'initialBrowserContext', 'polyfillFeatures']);

  return React.createElement(
    Head,
    props,
    React.createElement('meta', { charSet: 'utf-8' }),
    React.createElement('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }),
    React.createElement('link', { rel: 'stylesheet', href: assetUrl('/' + (styleName || 'index') + '.css', version) }),
    polyfillFeatures && React.createElement('script', { defer: true, src: 'https://polyfill.io/v2/polyfill.min.js?features=' + polyfillFeatures + '&unknown=polyfill' }),
    scriptName === false ? null : React.createElement('script', {
      dangerouslySetInnerHTML: {
        __html: '' + (moduleIdentifier ? 'window.MODULE_IDENTIFIER=\'' + moduleIdentifier + '\';' : '') + ('window.VERSION=\'' + version + '\';') + ('window.initialData=' + uneval(initialData) + ';') + (!initialBrowserContext ? '' : 'window.initialBrowserContext=' + uneval(initialBrowserContext) + ';')
      }
    }),
    scriptName === false ? null : React.createElement('script', { defer: true, src: assetUrl('/' + scriptName + '.js', version) }),
    children
  );
});
//# sourceMappingURL=AlpHead.js.map