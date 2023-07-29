import Cookies from 'cookies';
import _regeneratorRuntime from '@babel/runtime/helpers/esm/regeneratorRuntime';
import _extends from '@babel/runtime/helpers/esm/extends';
import _asyncToGenerator from '@babel/runtime/helpers/esm/asyncToGenerator';
import { StyleSheet } from 'react-native';
import { jsxs, Fragment, jsx } from 'react/jsx-runtime';

function createDocumentInitialProps(getMoreStyles) {
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(ctx) {
      var page, rnwStyle;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return ctx.renderPage();
          case 2:
            page = _context.sent;
            // @ts-expect-error -- RN doesn't have this type
            rnwStyle = StyleSheet.getSheet();
            return _context.abrupt("return", _extends({}, page, {
              styles: /*#__PURE__*/jsxs(Fragment, {
                children: [/*#__PURE__*/jsx("style", {
                  dangerouslySetInnerHTML: {
                    __html: rnwStyle.textContent
                  },
                  id: rnwStyle.id
                }), getMoreStyles == null ? void 0 : getMoreStyles()]
              })
            }));
          case 5:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function () {
      return _ref.apply(this, arguments);
    };
  }();
}

var getServerCookieValue = function getServerCookieValue(ctx, cookieName) {
  if (!ctx.req || !ctx.res) {
    throw new Error('Missing ctx.req or ctx.res. Make sure getInitialProps is set.');
  }
  var cookies = new Cookies(ctx.req, ctx.res);
  return cookies.get(cookieName) || null;
};

export { createDocumentInitialProps, getServerCookieValue };
//# sourceMappingURL=index-browser.es.js.map
