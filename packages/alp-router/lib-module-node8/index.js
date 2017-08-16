

export default function alpRouter(router) {
  return app => (app.router = router, app.context.urlGenerator = function (routeKey, params) {
    return router.toLocalizedPath(this.language, routeKey, params);
  }, app.context.redirectTo = function (to, params) {
    return this.redirect(router.toLocalizedPath(this.language, to, params));
  }, ctx => {
    let routeMatch = router.find(ctx.path, ctx.language);

    if (!routeMatch) throw ctx.status = 404, new Error(`Route not found: ${ctx.path}`);

    return ctx.route = routeMatch, routeMatch.ref(ctx);
  });
}
//# sourceMappingURL=index.js.map