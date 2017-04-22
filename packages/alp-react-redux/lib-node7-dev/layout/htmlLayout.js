'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LayoutOptionsType = undefined;

var _assetUrl = require('./assetUrl');

var _assetUrl2 = _interopRequireDefault(_assetUrl);

var _uneval = require('./uneval');

var _uneval2 = _interopRequireDefault(_uneval);

var _types = require('../types');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable jsx-a11y/html-has-lang, prefer-template */
const ReactElementType = _flowRuntime2.default.tdz(() => _types.ReactElementType);

const HelmetDataAttributeType = _flowRuntime2.default.type('HelmetDataAttributeType', _flowRuntime2.default.object(_flowRuntime2.default.property('toString', _flowRuntime2.default.function(_flowRuntime2.default.return(_flowRuntime2.default.string()))), _flowRuntime2.default.property('toComponent', _flowRuntime2.default.function(_flowRuntime2.default.return(_flowRuntime2.default.ref(ReactElementType))))));

const HelmetDataType = _flowRuntime2.default.type('HelmetDataType', _flowRuntime2.default.object(_flowRuntime2.default.property('htmlAttributes', HelmetDataAttributeType), _flowRuntime2.default.property('title', HelmetDataAttributeType), _flowRuntime2.default.property('base', HelmetDataAttributeType), _flowRuntime2.default.property('meta', HelmetDataAttributeType), _flowRuntime2.default.property('link', HelmetDataAttributeType), _flowRuntime2.default.property('script', HelmetDataAttributeType), _flowRuntime2.default.property('style', HelmetDataAttributeType)));

const LayoutOptionsType = exports.LayoutOptionsType = _flowRuntime2.default.type('LayoutOptionsType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('layoutBody', _flowRuntime2.default.nullable(_flowRuntime2.default.function())), _flowRuntime2.default.property('version', _flowRuntime2.default.string()), _flowRuntime2.default.property('moduleIdentifier', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.property('scriptName', _flowRuntime2.default.union(_flowRuntime2.default.string(), _flowRuntime2.default.boolean(false))), _flowRuntime2.default.property('styleName', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.property('initialData', _flowRuntime2.default.nullable(_flowRuntime2.default.any())), _flowRuntime2.default.property('initialBrowserContext', _flowRuntime2.default.nullable(_flowRuntime2.default.any())), _flowRuntime2.default.property('polyfillFeatures', _flowRuntime2.default.nullable(_flowRuntime2.default.string()))));

const wrapContent = content => `<div id="react-app">${content}</div>`;

exports.default = function htmlLayout(helmet, content, {
  layoutBody,
  version,
  moduleIdentifier,
  scriptName,
  styleName,
  initialData,
  initialBrowserContext,
  polyfillFeatures = 'default,es6,es7,localStorage,fetch,Intl'
}) {
  let _contentType = _flowRuntime2.default.string();

  const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.string());

  _flowRuntime2.default.param('helmet', HelmetDataType).assert(helmet);

  _flowRuntime2.default.param('content', _contentType).assert(content);

  return _returnType.assert(`<!doctype html>
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
</html>`);
};
//# sourceMappingURL=htmlLayout.js.map