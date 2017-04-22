'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assetUrl = require('./assetUrl');

var _assetUrl2 = _interopRequireDefault(_assetUrl);

var _uneval = require('./uneval');

var _uneval2 = _interopRequireDefault(_uneval);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable jsx-a11y/html-has-lang, prefer-template */
const wrapContent = content => `<div id="react-app">${content}</div>`;

exports.default = (helmet, content, {
  layoutBody,
  version,
  moduleIdentifier,
  scriptName,
  styleName,
  initialData,
  initialBrowserContext,
  polyfillFeatures = 'default,es6,es7,localStorage,fetch,Intl'
}) => `<!doctype html>
<html ${helmet.htmlAttributes.toString()}>
  <head>
    ${helmet.title.toString()}
    ${helmet.meta.toString()}
    ${helmet.link.toString()}
    ${helmet.base.toString()}
    <link rel="stylesheet" href="${(0, _assetUrl2.default)(`/${styleName || 'index'}.css`, version)}" />
    ${helmet.style.toString()}
    ${polyfillFeatures && `<script defer src="${`https://polyfill.io/v2/polyfill.min.js?features=${polyfillFeatures}&unknown=polyfill`}"></script>`}
    ${helmet.script.toString()}
    ${scriptName === false ? null : `<script>${`${moduleIdentifier ? `window.MODULE_IDENTIFIER='${moduleIdentifier}';` : ''}` + `window.VERSION='${version}';` + `window.initialData=${(0, _uneval2.default)(initialData)};` + (!initialBrowserContext ? '' : `window.initialBrowserContext=${(0, _uneval2.default)(initialBrowserContext)};`)}</script>`}
    ${scriptName === false ? null : `<script defer src="${(0, _assetUrl2.default)(`/${scriptName}.js`, version)}"></script>`}
  </head>
  <body ${helmet.bodyAttributes.toString()}>
    ${layoutBody ? layoutBody(wrapContent(content)) : wrapContent(content)}
  </body>
</html>`;
//# sourceMappingURL=htmlLayout.js.map