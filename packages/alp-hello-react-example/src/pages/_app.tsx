/* eslint-disable react/prop-types */
import { NativeBaseProvider } from 'native-base';
import type { AppType } from 'next/app';
import { IntlProvider } from 'react-intl';

const App: AppType = ({ Component, pageProps }) => {
  return (
    <NativeBaseProvider isSSR>
      <IntlProvider defaultLocale="en" locale="en">
        <Component {...pageProps} />
      </IntlProvider>
    </NativeBaseProvider>
  );
};

export default App;
