/// <reference types="node" />
import type { IncomingMessage, Server, ServerResponse } from "node:http";
import Koa from "koa";
import type { ParameterizedContext, DefaultState } from "koa";
import type { Router } from "router-segments";
import type { Config } from "./config";
import type { AlpLanguageContext } from "./language";
import type { AlpParamsContext, AlpParamsRequest } from "./params";
import type { AlpRouteRef, RouterContext as AlpRouterContext, UrlGenerator } from "./router";
import type { TranslateBaseContext, TranslateContext } from "./translate";
import type { NodeApplication, NodeConfig, Context as AlpContext, ContextState } from "./types";
export interface AlpNodeAppOptions {
    appDirname: string;
    packageDirname: string;
    config: Config & NodeConfig;
    certPath?: string;
    publicPath?: string;
}
declare module "koa" {
    interface DefaultState extends ContextState {
    }
    interface DefaultContext extends AlpContext, AlpParamsContext, AlpRouterContext, AlpLanguageContext, TranslateContext {
    }
    interface BaseContext extends AlpContext, TranslateBaseContext {
        urlGenerator: UrlGenerator;
        redirectTo: <P extends Record<string, unknown>>(to: string, params?: P) => void;
    }
    interface BaseRequest extends AlpParamsRequest {
    }
}
export declare class AlpNodeApp extends Koa<ContextState> implements NodeApplication {
    dirname: string;
    certPath: string;
    publicPath: string;
    config: Config & NodeConfig;
    _server?: Server;
    router?: Router<any, AlpRouteRef>;
    /**
     * @param {Object} [options]
     * @param {string} [options.certPath] directory of the ssl certificates
     * @param {string} [options.publicPath] directory of public files
     */
    constructor({ appDirname, packageDirname, config, certPath, publicPath, }: AlpNodeAppOptions);
    existsConfigSync(name: string): ReturnType<Config["existsConfigSync"]>;
    loadConfigSync(name: string): ReturnType<Config["loadConfigSync"]>;
    createContext<StateT = DefaultState>(req: IncomingMessage, res: ServerResponse): ParameterizedContext<StateT>;
    servePublic(): void;
    catchErrors(): void;
    listen(): never;
    /**
     * Close server and emit close event
     */
    close(): void;
    start(fn: () => Promise<void> | void): Promise<Server>;
}
export type { Context } from "koa";
export { type NodeApplication } from "./types";
//# sourceMappingURL=AlpNodeApp.d.ts.map