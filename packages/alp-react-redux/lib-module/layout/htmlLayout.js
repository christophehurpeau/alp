/* eslint-disable jsx-a11y/html-has-lang, prefer-template */
import assetUrl from './assetUrl';
import uneval from './uneval';


var wrapContent = function wrapContent(content) {
  return '<div id="react-app">' + content + '</div>';
};

export default (function (helmet, content, _ref) {
  var layoutBody = _ref.layoutBody,
      version = _ref.version,
      moduleIdentifier = _ref.moduleIdentifier,
      scriptName = _ref.scriptName,
      styleName = _ref.styleName,
      initialData = _ref.initialData,
      initialBrowserContext = _ref.initialBrowserContext,
      _ref$polyfillFeatures = _ref.polyfillFeatures,
      polyfillFeatures = _ref$polyfillFeatures === undefined ? 'default,es6,es7,localStorage,fetch,Intl' : _ref$polyfillFeatures;
  return '<!doctype html>\n<html ' + helmet.htmlAttributes.toString() + '>\n  <head>\n    ' + helmet.title.toString() + '\n    ' + helmet.meta.toString() + '\n    ' + helmet.link.toString() + '\n    ' + helmet.base.toString() + '\n    <link rel="stylesheet" href="' + assetUrl('/' + (styleName || 'index') + '.css', version) + '" />\n    ' + helmet.style.toString() + '\n    ' + (polyfillFeatures && '<script defer src="' + ('https://polyfill.io/v2/polyfill.min.js?features=' + polyfillFeatures + '&unknown=polyfill') + '"></script>') + '\n    ' + helmet.script.toString() + '\n    ' + (scriptName === false ? null : '<script>' + ('' + (moduleIdentifier ? 'window.MODULE_IDENTIFIER=\'' + moduleIdentifier + '\';' : '') + ('window.VERSION=\'' + version + '\';') + ('window.initialData=' + uneval(initialData) + ';') + (!initialBrowserContext ? '' : 'window.initialBrowserContext=' + uneval(initialBrowserContext) + ';')) + '</script>') + '\n    ' + (scriptName === false ? null : '<script defer src="' + assetUrl('/' + scriptName + '.js', version) + '"></script>') + '\n  </head>\n  <body ' + helmet.bodyAttributes.toString() + '>\n    ' + (layoutBody ? layoutBody(wrapContent(content)) : wrapContent(content)) + '\n  </body>\n</html>';
});
//# sourceMappingURL=htmlLayout.js.map