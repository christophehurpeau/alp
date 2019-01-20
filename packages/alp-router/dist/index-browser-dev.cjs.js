'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function alpRouter(router) {
  return function (app) {
    app.router = router;

    app.context.urlGenerator = function (routeKey, params) {
      return router.toLocalizedPath(this.language, routeKey, params);
    };

    app.context.redirectTo = function (to, params) {
      return this.redirect(router.toLocalizedPath(this.language, to, params));
    };

    return function (ctx) {
      var routeMatch = router.find(ctx.path, ctx.language);

      if (!routeMatch) {
        ctx.status = 404;
        throw new Error("Route not found: " + ctx.path);
      }

      ctx.route = routeMatch;
      return routeMatch.ref(ctx);
    };
  };
}

exports.default = alpRouter;
//# sourceMappingURL=index-browser-dev.cjs.js.map
