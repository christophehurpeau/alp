/* eslint-disable react/prop-types */
// @ts-expect-error -- types are missing
import { NextThemeProvider, useRootTheme } from "@tamagui/next-theme";
import { useDidFinishSSR } from "@tamagui/use-did-finish-ssr";
import { AlouetteProvider, Stack } from "alouette";
import type { AppType } from "next/app";
import NextScript from "next/script";
import { IntlProvider } from "react-intl";
import { useColorScheme } from "react-native";
import config from "../tamagui.config";
import "@tamagui/core/reset.css";

if (process.env.NODE_ENV === "production") {
  // eslint-disable-next-line import/no-unresolved, unicorn/prefer-module
  require("../../build/tamagui.css");
}

// eslint-disable-next-line react/function-component-definition
const App: AppType = ({ Component, pageProps }) => {
  const [theme, setTheme] = useRootTheme(); // TODO use getServerCookieValue to prevent blink on refresh.
  const colorScheme = useColorScheme();
  const didFinishSSR = useDidFinishSSR();

  // memo to avoid re-render on theme change
  // const contents = useMemo(() => {
  //   return <Component {...pageProps} />;
  // }, [pageProps]);

  const themeName = theme === "system" ? colorScheme || "light" : theme;

  return (
    <NextThemeProvider onChangeTheme={setTheme as any}>
      {/* https://tamagui.dev/docs/guides/next-js#mount-animations */}
      <NextScript id="tamagui-animations-mount">
        document.documentElement.classList.add('t_unmounted')
      </NextScript>

      <AlouetteProvider
        // because we do our custom getCSS() above, we disableInjectCSS here
        disableInjectCSS
        tamaguiConfig={config}
        defaultTheme={didFinishSSR ? themeName : "light"}
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
