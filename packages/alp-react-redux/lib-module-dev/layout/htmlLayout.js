/* eslint-disable jsx-a11y/html-has-lang, prefer-template */
import { Element as _Element } from 'react';
import assetUrl from './assetUrl';
import uneval from './uneval';

import t from 'flow-runtime';
var Element = t.tdz(function () {
  return _Element;
});
var HelmetDataAttributeType = t.type('HelmetDataAttributeType', t.object(t.property('toString', t.function(t.return(t.string()))), t.property('toComponent', t.function(t.return(t.ref(Element))))));
var HelmetDataType = t.type('HelmetDataType', t.object(t.property('htmlAttributes', HelmetDataAttributeType), t.property('title', HelmetDataAttributeType), t.property('base', HelmetDataAttributeType), t.property('meta', HelmetDataAttributeType), t.property('link', HelmetDataAttributeType), t.property('script', HelmetDataAttributeType), t.property('style', HelmetDataAttributeType)));


export var LayoutOptionsType = t.type('LayoutOptionsType', t.exactObject(t.property('layoutBody', t.nullable(t.function()), true), t.property('version', t.string()), t.property('scriptName', t.union(t.string(), t.boolean(false))), t.property('styleName', t.union(t.string(), t.boolean(false))), t.property('initialData', t.nullable(t.any()), true), t.property('polyfillFeatures', t.nullable(t.string()), true)));

export default (function htmlLayout(helmet, content, _ref) {
  var version = _ref.version,
      scriptName = _ref.scriptName,
      styleName = _ref.styleName,
      initialData = _ref.initialData,
      _ref$polyfillFeatures = _ref.polyfillFeatures,
      polyfillFeatures = _ref$polyfillFeatures === undefined ? 'default,es6,es7,localStorage,fetch,Intl' : _ref$polyfillFeatures;

  var _contentType = t.string();

  var _returnType = t.return(t.string());

  t.param('helmet', HelmetDataType).assert(helmet);
  t.param('content', _contentType).assert(content);
  return _returnType.assert('<!doctype html>\n<html ' + helmet.htmlAttributes.toString() + '>\n  <head>\n    ' + helmet.title.toString() + '\n    ' + helmet.meta.toString() + '\n    ' + helmet.link.toString() + '\n    ' + helmet.base.toString() + '\n    <link rel="stylesheet" href="' + assetUrl('/' + (styleName || 'index') + '.css', version) + '" />\n    ' + helmet.style.toString() + '\n    ' + (polyfillFeatures && '<script defer src="' + ('https://polyfill.io/v2/polyfill.min.js?features=' + polyfillFeatures + '&unknown=polyfill') + '"></script>') + '\n    ' + helmet.script.toString() + '\n    ' + (scriptName === false ? '' : '<script>\nwindow.VERSION=\'' + version + '\';\nwindow.__INITIAL_DATA__=' + uneval(initialData) + ';\n</script>\n<script defer src="' + assetUrl('/' + scriptName + '.js', version) + '"></script>') + '\n  </head>\n  <body ' + helmet.bodyAttributes.toString() + '>\n    <div id="react-app">' + content + '</div>\n  </body>\n</html>');
});
//# sourceMappingURL=htmlLayout.js.map