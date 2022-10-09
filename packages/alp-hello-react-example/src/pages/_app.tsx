import { NativeBaseProvider } from 'native-base';
import { AppProps } from 'next/app';
import { ReactElement } from 'react';
import { IntlProvider } from 'react-intl';

export default function App({ Component, pageProps }: AppProps): ReactElement {
  return (
    <NativeBaseProvider>
      <IntlProvider defaultLocale="en" locale="en">
        <Component {...pageProps} />
      </IntlProvider>
    </NativeBaseProvider>
  );
}
