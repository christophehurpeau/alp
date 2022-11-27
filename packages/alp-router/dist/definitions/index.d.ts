import type { Context, NodeApplication } from 'alp-types';
import type { Router, RouteMatch } from 'router-segments';
type ReturnType = (app: NodeApplication) => (ctx: Context) => Promise<void>;
export type UrlGenerator = <P extends Record<string, unknown> | undefined>(routeKey: string, params?: P) => string;
declare module 'alp-types' {
    interface NodeApplication {
        router?: Router;
    }
    interface BaseContext {
        urlGenerator: UrlGenerator;
        redirectTo: <P extends Record<string, unknown>>(to: string, params?: P) => Promise<void>;
    }
    interface Context {
        route: RouteMatch<any>;
    }
}
export default function alpRouter(router: Router): ReturnType;
export {};
//# sourceMappingURL=index.d.ts.map