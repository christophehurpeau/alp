import type { Context, NodeApplication } from 'alp-types';
import type { Router, RouteMatch } from 'router-segments';

export type AlpRouteRef = (ctx: Context) => Promise<void> | void;
type ReturnType = (app: NodeApplication) => AlpRouteRef;

export type UrlGenerator = <P extends Record<string, unknown> | undefined>(
  routeKey: string,
  params?: P,
) => string;

declare module 'alp-types' {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  interface NodeApplication {
    router?: Router<any, AlpRouteRef>;
  }

  interface BaseContext {
    urlGenerator: UrlGenerator;
    redirectTo: <P extends Record<string, unknown>>(
      to: string,
      params?: P,
    ) => Promise<void>;
  }

  // eslint-disable-next-line @typescript-eslint/no-shadow
  interface Context {
    route: RouteMatch<any, AlpRouteRef>;
  }
}

export default function alpRouter<Locales extends string>(
  router: Router<Locales, AlpRouteRef>,
): ReturnType {
  return (app: NodeApplication) => {
    app.router = router;

    app.context.urlGenerator = function <
      P extends Record<string, unknown> | undefined,
    >(this: Context, routeKey: string, params?: P): string {
      return router.toLocalizedPath(this.language as Locales, routeKey, params);
    };

    app.context.redirectTo = function <
      P extends Record<string, unknown> | undefined,
    >(this: Context, to: string, params?: P): Promise<void> {
      return this.redirect(
        router.toLocalizedPath(this.language as Locales, to, params),
      );
    };

    return async (ctx: Context): Promise<void> => {
      // eslint-disable-next-line unicorn/no-array-method-this-argument
      const routeMatch = router.find(ctx.request.path, ctx.language as Locales);

      if (!routeMatch) {
        ctx.status = 404;
        throw new Error(`Route not found: ${ctx.request.path}`);
      }

      ctx.route = routeMatch;

      await routeMatch.ref(ctx);
    };
  };
}
