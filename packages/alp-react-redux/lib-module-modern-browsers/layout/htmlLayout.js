/* eslint-disable jsx-a11y/html-has-lang, prefer-template */
import assetUrl from './assetUrl';
import uneval from './uneval';


const wrapContent = function wrapContent(content) {
  return `<div id="react-app">${content}</div>`;
};

export default (function (helmet, content, {
  layoutBody,
  version,
  moduleIdentifier,
  scriptName,
  styleName,
  initialData,
  initialBrowserContext,
  polyfillFeatures = 'default,es6,es7,localStorage,fetch,Intl'
}) {
  return `<!doctype html>
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
    ${scriptName === false ? null : `<script>${`${moduleIdentifier ? `window.MODULE_IDENTIFIER='${moduleIdentifier}';` : ''}` + `window.VERSION='${version}';` + `window.initialData=${uneval(initialData)};` + (!initialBrowserContext ? '' : `window.initialBrowserContext=${uneval(initialBrowserContext)};`)}</script>`}
    ${scriptName === false ? null : `<script defer src="${assetUrl(`/${scriptName}.js`, version)}"></script>`}
  </head>
  <body ${helmet.bodyAttributes.toString()}>
    ${layoutBody ? layoutBody(wrapContent(content)) : wrapContent(content)}
  </body>
</html>`;
});
//# sourceMappingURL=htmlLayout.js.map