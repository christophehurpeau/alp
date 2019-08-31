/* eslint-disable jsx-a11y/html-has-lang */
import { HelmetData } from 'react-helmet';
import assetUrl from './assetUrl';
import uneval from './uneval';

export interface LayoutOptions {
  version: string;
  scriptName: string | false;
  styleName: string | false;
  initialData?: any;
  polyfillFeatures?: string;
}

export default function htmlLayout(
  helmet: HelmetData,
  content: string,
  {
    version,
    scriptName,
    styleName,
    initialData,
    polyfillFeatures = 'default,es2015,es2016,es2017,localStorage,fetch,Intl',
  }: LayoutOptions,
): string {
  return `<!doctype html>
<html ${helmet.htmlAttributes.toString()}>
  <head>
    ${helmet.title.toString()}
    ${helmet.meta.toString()}
    ${helmet.link.toString()}
    ${helmet.base.toString()}
    <link rel="stylesheet" href="${assetUrl(
      `/${styleName || 'index'}.css`,
      version,
    )}" />
    ${helmet.style.toString()}
    ${polyfillFeatures &&
      `<script defer src="${`https://polyfill.io/v2/polyfill.min.js?features=${polyfillFeatures}&unknown=polyfill`}"></script>`}
    ${helmet.script.toString()}
    ${
      scriptName === false
        ? ''
        : `<script>
window.__VERSION__='${version}';
window.__INITIAL_DATA__=${uneval(initialData)};
</script>
<script defer src="${assetUrl(`/${scriptName}.js`, version)}"></script>`
    }
  </head>
  <body ${helmet.bodyAttributes.toString()}>
    <div id="react-app">${content}</div>
  </body>
</html>`;
}
