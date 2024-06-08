/// <reference types="koa" />
import type { Router, LocaleType, RouterBuilder, RouteMatch } from "router-segments";
import type { AlpNodeApp, Context } from "./AlpNodeApp";
export type AlpRouter<Locales extends LocaleType> = Router<Locales, AlpRouteRef>;
export type AlpRouteRef = (ctx: Context) => Promise<void> | void;
type ReturnType = (app: AlpNodeApp) => AlpRouteRef;
export interface RouterContext {
    route: RouteMatch<any, AlpRouteRef>;
}
export declare const createAlpRouterBuilder: <Locales extends string>() => RouterBuilder<Locales, AlpRouteRef>;
export type UrlGenerator = <P extends Record<string, unknown> | undefined>(routeKey: string, params?: P) => string;
export default function alpRouter<Locales extends string>(router: Router<Locales, AlpRouteRef>): ReturnType;
export {};
//# sourceMappingURL=router.d.ts.map