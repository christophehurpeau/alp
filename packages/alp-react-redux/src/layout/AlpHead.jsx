/* eslint-disable prefer-template */
import { Head } from 'fody/src';
import type { ReactElementType } from '../types';
import uneval from './uneval';
import assetUrl from './assetUrl';

type PropsType = {
  version: string,
  moduleIdentifier: ?string,
  scriptName: string,
  styleName: ?string,
  initialData: ?any,
  initialBrowserContext: ?any,
};

export default ({
  version,
  moduleIdentifier,
  scriptName,
  styleName,
  initialData,
  initialBrowserContext,
  ...props
}: PropsType): ReactElementType => (
  <Head {...props}>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,700,500,300,400italic" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href={assetUrl(`/${styleName || 'index'}.css`, version)} />
    <script defer src="https://polyfill.io/v2/polyfill.min.js?features=default,es6,localStorage,fetch,Intl&unknown=polyfill" />
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
    <script defer src={assetUrl(`/${scriptName}.js`, version)} />
  </Head>
);
