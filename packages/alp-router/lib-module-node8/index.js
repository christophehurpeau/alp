

export default function alpRouter(router) {
  return app => {
    app.router = router;

    app.context.urlGenerator = function (routeKey, params) {
      return router.toLocalizedPath(this.language, routeKey, params);
    };

    app.context.redirectTo = function (to, params) {
      return this.redirect(router.toLocalizedPath(this.language, to, params));
    };

    return ctx => {
      let routeMatch = router.find(ctx.path, ctx.language);

      if (!routeMatch) {
        ctx.status = 404;
        throw new Error(`Route not found: ${ctx.path}`);
      }

      ctx.route = routeMatch;

      return routeMatch.ref(ctx);
    };
  };
}
//# sourceMappingURL=index.js.map