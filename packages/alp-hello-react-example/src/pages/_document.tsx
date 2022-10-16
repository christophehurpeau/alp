import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
import type { ReactElement } from 'react';
import { Children } from 'react';
// @ts-expect-error -- @types/react-native-web does not exists
import { AppRegistry } from 'react-native-web';

// https://github.com/GeekyAnts/native-base-next-adapter/blob/master/document.js

// Force Next-generated DOM elements to fill their parent's height
const normalizeNextElements = `
  html, body, #__next {
    width: 100%;
    /* To smooth any scrolling behavior */
    -webkit-overflow-scrolling: touch;
    margin: 0px;
    padding: 0px;
    /* Allows content to fill the viewport and go beyond the bottom */
    min-height: 100%;
  }
  #__next {
    flex-shrink: 0;
    flex-basis: auto;
    flex-direction: column;
    flex-grow: 1;
    display: flex;
    flex: 1;
  }
  html {
    scroll-behavior: smooth;
    -webkit-text-size-adjust: 100%;
    height: 100%;
  }
  body {
    display: flex;
    overflow-y: auto;
    overscroll-behavior-y: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -ms-overflow-style: scrollbar;
  }
`;

export async function getInitialProps({
  renderPage,
}: Parameters<typeof NextDocument['getInitialProps']>[0]): ReturnType<
  typeof NextDocument['getInitialProps']
> {
  AppRegistry.registerComponent('Main', () => Main);
  const { getStyleElement } = AppRegistry.getApplication('Main');
  const page = await renderPage();
  const styles = [
    <style dangerouslySetInnerHTML={{ __html: normalizeNextElements }} />,
    getStyleElement(),
  ];
  return { ...page, styles: Children.toArray(styles) };
}

export default class MyDocument extends NextDocument {
  static getInitialProps = getInitialProps;

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
