import type NextDocument from 'next/document';
import type { DocumentContext } from 'next/document';
export declare const normalizeNextElementsCSS = "\n  html, body, #__next {\n    width: 100%;\n    /* To smooth any scrolling behavior */\n    -webkit-overflow-scrolling: touch;\n    margin: 0px;\n    padding: 0px;\n    /* Allows content to fill the viewport and go beyond the bottom */\n    min-height: 100%;\n  }\n  #__next {\n    flex-shrink: 0;\n    flex-basis: auto;\n    flex-direction: column;\n    flex-grow: 1;\n    display: flex;\n    flex: 1;\n  }\n  html {\n    scroll-behavior: smooth;\n    -webkit-text-size-adjust: 100%;\n    height: 100%;\n  }\n  body {\n    display: flex;\n    overflow-y: auto;\n    overscroll-behavior-y: none;\n    text-rendering: optimizeLegibility;\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale;\n    -ms-overflow-style: scrollbar;\n  }\n";
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
export declare function getDocumentInitialProps(ctx: DocumentContext): ReturnType<(typeof NextDocument)['getInitialProps']>;
//# sourceMappingURL=getDocumentInitialProps.d.ts.map