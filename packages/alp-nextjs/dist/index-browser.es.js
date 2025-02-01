import Cookies from 'cookies';
import _extends from '@babel/runtime/helpers/esm/extends';
import { StyleSheet } from 'react-native';
import { jsxs, Fragment, jsx } from 'react/jsx-runtime';

function createDocumentInitialProps(getMoreStyles) {
  return async ctx => {
    const page = await ctx.renderPage();

    // @ts-expect-error -- RN doesn't have this type
    const rnwStyle = StyleSheet.getSheet();
    return _extends({}, page, {
      styles: /*#__PURE__*/jsxs(Fragment, {
        children: [/*#__PURE__*/jsx("style", {
          dangerouslySetInnerHTML: {
            __html: rnwStyle.textContent
          },
          id: rnwStyle.id
        }), getMoreStyles == null ? undefined : getMoreStyles()]
      })
    });
  };
}

const getServerCookieValue = (ctx, cookieName) => {
  if (!ctx.req || !ctx.res) {
    throw new Error("Missing ctx.req or ctx.res. Make sure getInitialProps is set.");
  }
  const cookies = new Cookies(ctx.req, ctx.res);
  return cookies.get(cookieName) || null;
};

export { createDocumentInitialProps, getServerCookieValue };
//# sourceMappingURL=index-browser.es.js.map
