/* eslint-disable prefer-template */
import { Head } from 'fody/src';
import type { ReactElementType, ReactNodeType } from '../types';
import uneval from './uneval';
import assetUrl from './assetUrl';

type PropsType = {
  children: ?ReactNodeType,
  version: string,
  moduleIdentifier: ?string,
  scriptName: string | false,
  styleName: ?string,
  initialData: ?any,
  initialBrowserContext: ?any,
};

export default ({
  children,
  version,
  moduleIdentifier,
  scriptName,
  styleName,
  initialData,
  initialBrowserContext,
  polyfillFeatures = 'default,es6,es7,localStorage,fetch,Intl',
  ...props
}: PropsType): ReactElementType => (
  <Head {...props}>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href={assetUrl(`/${styleName || 'index'}.css`, version)} />
    {polyfillFeatures && <script defer src={`https://polyfill.io/v2/polyfill.min.js?features=${polyfillFeatures}&unknown=polyfill`} />}
    {scriptName === false ? null : (
      <script
        dangerouslySetInnerHTML={{
          __html:
            (`${moduleIdentifier ? `window.MODULE_IDENTIFIER='${moduleIdentifier}';` : ''}`)
            + `window.VERSION='${version}';`
            + `window.initialData=${uneval(initialData)};`
            + (!initialBrowserContext ? '' : (
                `window.initialBrowserContext=${uneval(initialBrowserContext)};`
            )),
        }}
      />
    )}
    {scriptName === false ? null : <script defer src={assetUrl(`/${scriptName}.js`, version)} />}
    {children}
  </Head>
);
