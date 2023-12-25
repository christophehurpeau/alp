import type { Context, NodeApplication } from 'alp-types';
import type { Router, RouteMatch } from 'router-segments';
export type AlpRouteRef = (ctx: Context) => Promise<void> | void;
type ReturnType = (app: NodeApplication) => AlpRouteRef;
export type UrlGenerator = <P extends Record<string, unknown> | undefined>(routeKey: string, params?: P) => string;
declare module 'alp-types' {
    interface NodeApplication {
        router?: Router<any, AlpRouteRef>;
    }
    interface BaseContext {
        urlGenerator: UrlGenerator;
        redirectTo: <P extends Record<string, unknown>>(to: string, params?: P) => Promise<void>;
    }
    interface Context {
        route: RouteMatch<any, AlpRouteRef>;
    }
}
export default function alpRouter<Locales extends string>(router: Router<Locales, AlpRouteRef>): ReturnType;
export {};
//# sourceMappingURL=index.d.ts.map