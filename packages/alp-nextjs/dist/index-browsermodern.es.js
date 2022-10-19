import { Main } from 'next/document';
import { Children } from 'react';
import { AppRegistry } from 'react-native-web';
import { jsx } from 'react/jsx-runtime';

const normalizeNextElementsCSS = `
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

/**
 *
 * @example
 * ```
 * export { getDocumentInitialProps as getInitialProps } from 'alp-nextjs';
 *
 * export default class MyDocument extends NextDocument {
 *   static getInitialProps = getDocumentInitialProps;
 * }
 * ```
 */
async function getDocumentInitialProps({
  renderPage
}) {
  AppRegistry.registerComponent('Main', () => Main);
  const {
    getStyleElement
  } = AppRegistry.getApplication('Main');
  const page = await renderPage();
  const styles = [/*#__PURE__*/jsx("style", {
    dangerouslySetInnerHTML: {
      __html: normalizeNextElementsCSS
    }
  }), getStyleElement()];
  return {
    ...page,
    styles: Children.toArray(styles)
  };
}

export { getDocumentInitialProps, normalizeNextElementsCSS };
//# sourceMappingURL=index-browsermodern.es.js.map
