import Cookies from 'cookies';
import _regeneratorRuntime from '@babel/runtime/helpers/esm/regeneratorRuntime';
import _extends from '@babel/runtime/helpers/esm/extends';
import _asyncToGenerator from '@babel/runtime/helpers/esm/asyncToGenerator';
import { Main } from 'next/document';
import { Children } from 'react';
import { AppRegistry } from 'react-native-web';
import { jsx } from 'react/jsx-runtime';

var normalizeNextElementsCSS = "\n  html, body, #__next {\n    width: 100%;\n    /* To smooth any scrolling behavior */\n    -webkit-overflow-scrolling: touch;\n    margin: 0px;\n    padding: 0px;\n    /* Allows content to fill the viewport and go beyond the bottom */\n    min-height: 100%;\n  }\n  #__next {\n    flex-shrink: 0;\n    flex-basis: auto;\n    flex-direction: column;\n    flex-grow: 1;\n    display: flex;\n    flex: 1;\n  }\n  html {\n    scroll-behavior: smooth;\n    -webkit-text-size-adjust: 100%;\n    height: 100%;\n  }\n  body {\n    display: flex;\n    overflow-y: auto;\n    overscroll-behavior-y: none;\n    text-rendering: optimizeLegibility;\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale;\n    -ms-overflow-style: scrollbar;\n  }\n";

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
function getDocumentInitialProps() {
  return _getDocumentInitialProps.apply(this, arguments);
}
function _getDocumentInitialProps() {
  _getDocumentInitialProps = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(ctx) {
    var _AppRegistry$getAppli, getStyleElement, page, styles;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          AppRegistry.registerComponent('Main', function () {
            return Main;
          });
          _AppRegistry$getAppli = AppRegistry.getApplication('Main'), getStyleElement = _AppRegistry$getAppli.getStyleElement;
          _context.next = 4;
          return ctx.renderPage();
        case 4:
          page = _context.sent;
          styles = [/*#__PURE__*/jsx("style", {
            dangerouslySetInnerHTML: {
              __html: normalizeNextElementsCSS
            }
          }), getStyleElement()];
          return _context.abrupt("return", _extends({}, page, {
            styles: Children.toArray(styles)
          }));
        case 7:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _getDocumentInitialProps.apply(this, arguments);
}

var getServerCookieValue = function getServerCookieValue(ctx, cookieName) {
  if (!ctx.req || !ctx.res) {
    throw new Error('Missing ctx.req or ctx.res. Make sure getInitialProps is set.');
  }
  var cookies = new Cookies(ctx.req, ctx.res);
  return cookies.get(cookieName) || null;
};

export { getDocumentInitialProps, getServerCookieValue, normalizeNextElementsCSS };
//# sourceMappingURL=index-browser.es.js.map
