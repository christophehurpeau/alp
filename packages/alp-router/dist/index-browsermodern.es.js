function alpRouter(router) {
  return app => {
    app.router = router;
    app.context.urlGenerator = function (routeKey, params) {
      return router.toLocalizedPath(this.language, routeKey, params);
    };
    app.context.redirectTo = function (to, params) {
      return this.redirect(router.toLocalizedPath(this.language, to, params));
    };
    return ctx => {
      // eslint-disable-next-line unicorn/no-array-method-this-argument
      const routeMatch = router.find(ctx.request.path, ctx.language);
      if (!routeMatch) {
        ctx.status = 404;
        throw new Error(`Route not found: ${ctx.request.path}`);
      }
      ctx.route = routeMatch;
      return routeMatch.ref(ctx);
    };
  };
}

export { alpRouter as default };
//# sourceMappingURL=index-browsermodern.es.js.map
