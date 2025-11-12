/* eslint-disable react/prop-types */

import type { ColorScheme } from "@tamagui/core";
import { NextThemeProvider, useRootTheme } from "@tamagui/next-theme";
import { useDidFinishSSR } from "@tamagui/use-did-finish-ssr";
import { AlouetteProvider, Stack } from "alouette";
import type { AppType } from "next/app";
import NextScript from "next/script";
import { IntlProvider } from "react-intl";
import config from "../tamagui.config";
import "@tamagui/core/reset.css";

if (process.env.NODE_ENV === "production") {
  // eslint-disable-next-line import/no-unresolved
  require("../../build/tamagui.css");
}

// eslint-disable-next-line react/function-component-definition
const App: AppType = ({ Component, pageProps }) => {
  const [theme, setTheme] = useRootTheme(); // TODO use getServerCookieValue to prevent blink on refresh.

  const didFinishSSR = useDidFinishSSR();

  // memo to avoid re-render on theme change
  // const contents = useMemo(() => {
  //   return <Component {...pageProps} />;
  // }, [pageProps]);

  return (
    <NextThemeProvider
      onChangeTheme={(name) => {
        setTheme(name as ColorScheme);
      }}
    >
      {/* https://tamagui.dev/docs/guides/next-js#mount-animations */}
      <NextScript id="tamagui-animations-mount">
        document.documentElement.classList.add('t_unmounted')
      </NextScript>

      <AlouetteProvider
        // because we do our custom getCSS() above, we disableInjectCSS here
        disableInjectCSS
        tamaguiConfig={config}
        defaultTheme={didFinishSSR ? theme : "light"}
      >
        <Stack
          backgroundColor={didFinishSSR ? "$backgroundColor" : undefined}
          minHeight="100vh"
        >
          <IntlProvider defaultLocale="en" locale="en">
            {/* {contents} */}
            <Component {...pageProps} />
          </IntlProvider>
        </Stack>
      </AlouetteProvider>
    </NextThemeProvider>
  );
};

export default App;
