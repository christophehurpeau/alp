/* eslint-disable jsx-a11y/html-has-lang, prefer-template */
import assetUrl from './assetUrl';
import uneval from './uneval';
import type { ReactElementType } from '../types';

type HelmetDataAttributeType = {
  toString(): string,
  toComponent(): ReactElementType,
};

type HelmetDataType = {
  htmlAttributes: HelmetDataAttributeType,
  title: HelmetDataAttributeType,
  base: HelmetDataAttributeType,
  meta: HelmetDataAttributeType,
  link: HelmetDataAttributeType,
  script: HelmetDataAttributeType,
  style: HelmetDataAttributeType,
};

export type LayoutOptionsType = {|
  layoutBody: ?Function,
  version: string,
  scriptName: string | false,
  styleName: string | false,
  initialData: ?any,
  polyfillFeatures: ?string,
|};

export default (
  helmet: HelmetDataType,
  content: string,
  {
    version,
    scriptName,
    styleName,
    initialData,
    polyfillFeatures = 'default,es6,es7,localStorage,fetch,Intl',
  },
): string =>
  `<!doctype html>
<html ${helmet.htmlAttributes.toString()}>
  <head>
    ${helmet.title.toString()}
    ${helmet.meta.toString()}
    ${helmet.link.toString()}
    ${helmet.base.toString()}
    <link rel="stylesheet" href="${assetUrl(`/${styleName || 'index'}.css`, version)}" />
    ${helmet.style.toString()}
    ${polyfillFeatures &&
      `<script defer src="${`https://polyfill.io/v2/polyfill.min.js?features=${polyfillFeatures}&unknown=polyfill`}"></script>`}
    ${helmet.script.toString()}
    ${scriptName === false
      ? ''
      : `<script>
window.VERSION='${version}';
window.__INITIAL_DATA__=${uneval(initialData)};
</script>
<script defer src="${assetUrl(`/${scriptName}.js`, version)}"></script>`}
  </head>
  <body ${helmet.bodyAttributes.toString()}>
    <div id="react-app">${content}</div>
  </body>
</html>`;
