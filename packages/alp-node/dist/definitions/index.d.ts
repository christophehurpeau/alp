import type { AlpNodeAppOptions } from "./AlpNodeApp";
import { AlpNodeApp } from "./AlpNodeApp";
import { Config } from "./config";
export type { BaseContext, NodeApplication, NodeConfig, ContextState, ContextSanitizedState, } from "./types";
export type { Context } from "./AlpNodeApp";
export declare const appDirname: string;
export declare const packageDirname: string;
export declare const packageConfig: Record<string, unknown>;
export declare const config: Config & import("./types").NodeConfig;
export type AppOptions = Omit<AlpNodeAppOptions, "appDirname" | "config" | "packageDirname">;
export default class App extends AlpNodeApp {
    constructor(options?: AppOptions);
}
export { Config } from "./config";
export { default as router, createAlpRouterBuilder, type AlpRouteRef, type AlpRouter, } from "./router";
//# sourceMappingURL=index.d.ts.map