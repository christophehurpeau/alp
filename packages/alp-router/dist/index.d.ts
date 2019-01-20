import { Router } from 'router-segments';
import { Context, NodeApplication } from 'alp-types';
declare type ReturnType = (app: NodeApplication) => (ctx: Context) => Promise<void>;
export declare type UrlGenerator = (routeKey: string, params: any) => string;
declare module 'alp-types' {
    interface NodeApplication {
        router?: Router;
    }
    interface Context {
        urlGenerator: UrlGenerator;
        redirectTo: (to: string, params: any) => any;
    }
}
export default function alpRouter(router: Router): ReturnType;
export {};
//# sourceMappingURL=index.d.ts.map