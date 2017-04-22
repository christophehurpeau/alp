/* eslint-disable jsx-a11y/html-has-lang, prefer-template */
import assetUrl from './assetUrl';
import uneval from './uneval';
import { ReactElementType as _ReactElementType } from '../types';

import t from 'flow-runtime';
var ReactElementType = t.tdz(function () {
  return _ReactElementType;
});
var HelmetDataAttributeType = t.type('HelmetDataAttributeType', t.object(t.property('toString', t.function(t.return(t.string()))), t.property('toComponent', t.function(t.return(t.ref(ReactElementType))))));
var HelmetDataType = t.type('HelmetDataType', t.object(t.property('htmlAttributes', HelmetDataAttributeType), t.property('title', HelmetDataAttributeType), t.property('base', HelmetDataAttributeType), t.property('meta', HelmetDataAttributeType), t.property('link', HelmetDataAttributeType), t.property('script', HelmetDataAttributeType), t.property('style', HelmetDataAttributeType)));


export var LayoutOptionsType = t.type('LayoutOptionsType', t.exactObject(t.property('layoutBody', t.nullable(t.function())), t.property('version', t.string()), t.property('moduleIdentifier', t.nullable(t.string())), t.property('scriptName', t.union(t.string(), t.boolean(false))), t.property('styleName', t.nullable(t.string())), t.property('initialData', t.nullable(t.any())), t.property('initialBrowserContext', t.nullable(t.any())), t.property('polyfillFeatures', t.nullable(t.string()))));

var wrapContent = function wrapContent(content) {
  return '<div id="react-app">' + content + '</div>';
};

export default (function htmlLayout(helmet, content, _ref) {
  var layoutBody = _ref.layoutBody,
      version = _ref.version,
      moduleIdentifier = _ref.moduleIdentifier,
      scriptName = _ref.scriptName,
      styleName = _ref.styleName,
      initialData = _ref.initialData,
      initialBrowserContext = _ref.initialBrowserContext,
      _ref$polyfillFeatures = _ref.polyfillFeatures,
      polyfillFeatures = _ref$polyfillFeatures === undefined ? 'default,es6,es7,localStorage,fetch,Intl' : _ref$polyfillFeatures;

  var _contentType = t.string();

  var _returnType = t.return(t.string());

  t.param('helmet', HelmetDataType).assert(helmet);
  t.param('content', _contentType).assert(content);
  return _returnType.assert('<!doctype html>\n<html ' + helmet.htmlAttributes.toString() + '>\n  <head>\n    ' + helmet.title.toString() + '\n    ' + helmet.meta.toString() + '\n    ' + helmet.link.toString() + '\n    ' + helmet.base.toString() + '\n    <link rel="stylesheet" href="' + assetUrl('/' + (styleName || 'index') + '.css', version) + '" />\n    ' + helmet.style.toString() + '\n    ' + (polyfillFeatures && '<script defer src="' + ('https://polyfill.io/v2/polyfill.min.js?features=' + polyfillFeatures + '&unknown=polyfill') + '"></script>') + '\n    ' + helmet.script.toString() + '\n    ' + (scriptName === false ? null : '<script>' + ('' + (moduleIdentifier ? 'window.MODULE_IDENTIFIER=\'' + moduleIdentifier + '\';' : '') + ('window.VERSION=\'' + version + '\';') + ('window.initialData=' + uneval(initialData) + ';') + (!initialBrowserContext ? '' : 'window.initialBrowserContext=' + uneval(initialBrowserContext) + ';')) + '</script>') + '\n    ' + (scriptName === false ? null : '<script defer src="' + assetUrl('/' + scriptName + '.js', version) + '"></script>') + '\n  </head>\n  <body ' + helmet.bodyAttributes.toString() + '>\n    ' + (layoutBody ? layoutBody(wrapContent(content)) : wrapContent(content)) + '\n  </body>\n</html>');
});
//# sourceMappingURL=htmlLayout.js.map