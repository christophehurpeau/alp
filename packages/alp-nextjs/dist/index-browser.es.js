import Cookies from 'cookies';
import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { StyleSheet } from 'react-native-web';

function createDocumentInitialProps(getMoreStyles) {
  return async (ctx) => {
    const page = await ctx.renderPage();
    const rnwStyle = StyleSheet.getSheet();
    return {
      ...page,
      styles: /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          "style",
          {
            dangerouslySetInnerHTML: { __html: rnwStyle.textContent },
            id: rnwStyle.id
          }
        ),
        getMoreStyles?.()
      ] })
    };
  };
}

const getServerCookieValue = (ctx, cookieName) => {
  if (!ctx.req || !ctx.res) {
    throw new Error(
      "Missing ctx.req or ctx.res. Make sure getInitialProps is set."
    );
  }
  const cookies = new Cookies(ctx.req, ctx.res);
  return cookies.get(cookieName) || null;
};

export { createDocumentInitialProps, getServerCookieValue };
//# sourceMappingURL=index-browser.es.js.map
