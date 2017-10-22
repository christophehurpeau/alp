
import assetUrl from './assetUrl'; /* eslint-disable jsx-a11y/html-has-lang, prefer-template */

import uneval from './uneval';

export default ((helmet, content, {
  version,
  scriptName,
  styleName,
  initialData,
  polyfillFeatures = 'default,es6,es7,localStorage,fetch,Intl'
}) => `<!doctype html>
<html ${helmet.htmlAttributes.toString()}>
  <head>
    ${helmet.title.toString()}
    ${helmet.meta.toString()}
    ${helmet.link.toString()}
    ${helmet.base.toString()}
    <link rel="stylesheet" href="${assetUrl(`/${styleName || 'index'}.css`, version)}" />
    ${helmet.style.toString()}
    ${polyfillFeatures && `<script defer src="${`https://polyfill.io/v2/polyfill.min.js?features=${polyfillFeatures}&unknown=polyfill`}"></script>`}
    ${helmet.script.toString()}
    ${scriptName === false ? '' : `<script>
window.VERSION='${version}';
window.__INITIAL_DATA__=${uneval(initialData)};
</script>
<script defer src="${assetUrl(`/${scriptName}.js`, version)}"></script>`}
  </head>
  <body ${helmet.bodyAttributes.toString()}>
    <div id="react-app">${content}</div>
  </body>
</html>`);
//# sourceMappingURL=htmlLayout.js.map