/* eslint-disable react/prop-types */
import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme';
import type { AppType } from 'next/app';
import NextScript from 'next/script';
import { IntlProvider } from 'react-intl';
import { TamaguiProvider } from 'tamagui';
import config from '../tamagui.config';

import '@tamagui/core/reset.css';

if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line global-require
  require('../../build/tamagui.css');
}

const App: AppType = ({ Component, pageProps }) => {
  const [theme, setTheme] = useRootTheme(); // TODO use getServerCookieValue to prevent blink on refresh.

  // memo to avoid re-render on theme change
  // const contents = useMemo(() => {
  //   return <Component {...pageProps} />;
  // }, [pageProps]);

  return (
    <NextThemeProvider onChangeTheme={setTheme as any}>
      {/* https://tamagui.dev/docs/guides/next-js#mount-animations */}
      <NextScript id="tamagui-animations-mount">
        document.documentElement.classList.add('t_unmounted')
      </NextScript>

      <TamaguiProvider
        // because we do our custom getCSS() above, we disableInjectCSS here
        disableInjectCSS
        disableRootThemeClass
        config={config}
        defaultTheme={theme}
      >
        <IntlProvider defaultLocale="en" locale="en">
          {/* {contents} */}
          <Component {...pageProps} />
        </IntlProvider>
      </TamaguiProvider>
    </NextThemeProvider>
  );
};

export default App;
