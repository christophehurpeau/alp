/// <reference types="node" />
import type { IncomingMessage, Server, ServerResponse } from 'http';
import type { Config } from 'alp-node-config';
import type { NodeApplication, NodeConfig, Context as AlpContext, ContextState } from 'alp-types';
import Koa from 'koa';
import type { ParameterizedContext, DefaultState, Context } from 'koa';
export interface AlpNodeAppOptions {
    appDirname: string;
    packageDirname: string;
    config: Config & NodeConfig;
    certPath?: string;
    publicPath?: string;
}
declare module 'koa' {
    interface DefaultState extends ContextState {
    }
    interface DefaultContext extends AlpContext {
    }
    interface BaseContext extends AlpContext {
    }
}
export type { Context };
export declare class AlpNodeApp extends Koa<ContextState> implements NodeApplication {
    dirname: string;
    certPath: string;
    publicPath: string;
    config: NodeConfig & Config;
    _server?: Server;
    /**
     * @param {Object} [options]
     * @param {string} [options.certPath] directory of the ssl certificates
     * @param {string} [options.publicPath] directory of public files
     */
    constructor({ appDirname, packageDirname, config, certPath, publicPath, }: AlpNodeAppOptions);
    existsConfigSync(name: string): ReturnType<Config['existsConfigSync']>;
    loadConfigSync(name: string): ReturnType<Config['loadConfigSync']>;
    createContext<StateT = DefaultState>(req: IncomingMessage, res: ServerResponse): ParameterizedContext<StateT>;
    servePublic(): void;
    catchErrors(): void;
    listen(): Server;
    /**
     * Close server and emit close event
     */
    close(): void;
    start(fn: () => Promise<void> | void): Promise<Server>;
}
//# sourceMappingURL=AlpNodeApp.d.ts.map