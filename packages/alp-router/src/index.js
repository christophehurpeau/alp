import type { RouterType } from 'router-segments';

type AppType = any;
type ReturnType = (app: AppType) => (ctx: Object) => Promise<void>;

export default function alpRouter(router: RouterType): ReturnType {
  return (app: AppType) => {
    app.router = router;

    app.context.urlGenerator = function(routeKey: string, params: any): string {
      return router.toLocalizedPath(this.language, routeKey, params);
    };

    app.context.redirectTo = function(to: string, params: any): any {
      return this.redirect(router.toLocalizedPath(this.language, to, params));
    };

    return (ctx: Object) => {
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
