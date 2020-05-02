import { Router } from 'router-segments';
import { Context, NodeApplication } from 'alp-types';

type ReturnType = (app: NodeApplication) => (ctx: Context) => Promise<void>;

export type UrlGenerator = (routeKey: string, params: any) => string;

declare module 'alp-types' {
  interface NodeApplication {
    router?: Router;
  }

  interface Context {
    urlGenerator: UrlGenerator;
    redirectTo: (to: string, params: any) => any;
  }
}

export default function alpRouter(router: Router): ReturnType {
  return (app: NodeApplication) => {
    app.router = router;

    app.context.urlGenerator = function (
      routeKey: string,
      params: any,
    ): string {
      return router.toLocalizedPath(this.language, routeKey, params);
    };

    app.context.redirectTo = function (to: string, params: any): any {
      return this.redirect(router.toLocalizedPath(this.language, to, params));
    };

    return (ctx: Context) => {
      const routeMatch = router.find(ctx.path, ctx.language);

      if (!routeMatch) {
        ctx.status = 404;
        throw new Error(`Route not found: ${ctx.path}`);
      }

      ctx.route = routeMatch;

      return routeMatch.ref(ctx);
    };
  };
}
