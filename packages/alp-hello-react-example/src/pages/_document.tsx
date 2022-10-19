import { getDocumentInitialProps } from 'alp-nextjs';
import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
import type { ReactElement } from 'react';

export { getDocumentInitialProps as getInitialProps } from 'alp-nextjs';

export default class MyDocument extends NextDocument {
  static getInitialProps = getDocumentInitialProps;

  render(): ReactElement {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
