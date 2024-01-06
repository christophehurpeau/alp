import type {
  Router,
  LocaleType,
  RouterBuilder,
  RouteMatch,
} from 'router-segments';
import { createRouterBuilder } from 'router-segments';
import type { AlpNodeApp, Context } from './AlpNodeApp';

export type AlpRouter<Locales extends LocaleType> = Router<
  Locales,
  AlpRouteRef
>;
export type AlpRouteRef = (ctx: Context) => Promise<void> | void;
type ReturnType = (app: AlpNodeApp) => AlpRouteRef;

export interface RouterContext {
  route: RouteMatch<any, AlpRouteRef>;
}
export const createAlpRouterBuilder = <
  Locales extends LocaleType,
>(): RouterBuilder<Locales, AlpRouteRef> =>
  createRouterBuilder<Locales, AlpRouteRef>();

export type UrlGenerator = <P extends Record<string, unknown> | undefined>(
  routeKey: string,
  params?: P,
) => string;

export default function alpRouter<Locales extends string>(
  router: Router<Locales, AlpRouteRef>,
): ReturnType {
  return (app: AlpNodeApp) => {
    app.router = router;

    app.context.urlGenerator = function <
      P extends Record<string, unknown> | undefined,
    >(this: Context, routeKey: string, params?: P): string {
      return router.toLocalizedPath(this.language as Locales, routeKey, params);
    };

    app.context.redirectTo = function <
      P extends Record<string, unknown> | undefined,
    >(this: Context, to: string, params?: P): void {
      this.redirect(
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
