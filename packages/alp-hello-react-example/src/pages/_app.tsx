import { NativeBaseProvider } from 'native-base';
import type { AppProps } from 'next/app';
import type { ReactElement } from 'react';
import { IntlProvider } from 'react-intl';

export default function App({ Component, pageProps }: AppProps): ReactElement {
  return (
    <NativeBaseProvider isSSR>
      <IntlProvider defaultLocale="en" locale="en">
        <Component {...pageProps} />
      </IntlProvider>
    </NativeBaseProvider>
  );
}
