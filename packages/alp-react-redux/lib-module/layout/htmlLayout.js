/* eslint-disable jsx-a11y/html-has-lang, prefer-template */
import assetUrl from './assetUrl';
import uneval from './uneval';


export default (function (helmet, content, _ref) {
  var version = _ref.version,
      scriptName = _ref.scriptName,
      styleName = _ref.styleName,
      initialData = _ref.initialData,
      _ref$polyfillFeatures = _ref.polyfillFeatures,
      polyfillFeatures = _ref$polyfillFeatures === void 0 ? 'default,es6,es7,localStorage,fetch,Intl' : _ref$polyfillFeatures;
  return '<!doctype html>\n<html ' + helmet.htmlAttributes.toString() + '>\n  <head>\n    ' + helmet.title.toString() + '\n    ' + helmet.meta.toString() + '\n    ' + helmet.link.toString() + '\n    ' + helmet.base.toString() + '\n    <link rel="stylesheet" href="' + assetUrl('/' + (styleName || 'index') + '.css', version) + '" />\n    ' + helmet.style.toString() + '\n    ' + (polyfillFeatures && '<script defer src="' + ('https://polyfill.io/v2/polyfill.min.js?features=' + polyfillFeatures + '&unknown=polyfill') + '"></script>') + '\n    ' + helmet.script.toString() + '\n    ' + (scriptName === false ? null : '<script>' + ('window.VERSION=\'' + version + '\';window.__INITIAL_DATA__=' + uneval(initialData) + ';') + '</script>') + '\n    ' + (scriptName === false ? null : '<script defer src="' + assetUrl('/' + scriptName + '.js', version) + '"></script>') + '\n  </head>\n  <body ' + helmet.bodyAttributes.toString() + '>\n    <div id="react-app">' + content + '</div>\n  </body>\n</html>';
});
//# sourceMappingURL=htmlLayout.js.map