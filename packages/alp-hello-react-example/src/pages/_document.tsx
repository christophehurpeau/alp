import { createDocumentInitialProps } from "alp-nextjs";
import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import type { ReactElement } from "react";
import Tamagui from "../tamagui.config";

export default class MyDocument extends NextDocument {
  static override getInitialProps = createDocumentInitialProps(() => (
    <style
      dangerouslySetInnerHTML={{
        __html: Tamagui.getCSS({
          // if you are using "outputCSS" option, you should use this "exclude"
          // if not, then you can leave the option out
          exclude:
            process.env.NODE_ENV === "production" ? "design-system" : null,
        }),
      }}
    />
  ));

  override render(): ReactElement {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
