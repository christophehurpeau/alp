/// <reference types="node" />
import { IncomingMessage, Server, ServerResponse } from 'http';
import Koa, { BaseContext, DefaultState, ParameterizedContext } from 'koa';
import { Config } from 'alp-node-config';
import { NodeApplication, NodeConfig, Context as AlpContext } from 'alp-types';
export { Config };
export declare const appDirname: string;
export declare const packageDirname: string;
export declare const packageConfig: any;
export declare const config: Config & NodeConfig;
interface Options {
    certPath?: string;
    publicPath?: string;
}
declare module 'koa' {
    interface BaseContext extends AlpContext {
    }
}
export declare type Context<State = any, SanitizedState = any> = AlpContext<State, SanitizedState> & ParameterizedContext<State>;
export default class Alp extends Koa implements NodeApplication {
    dirname: string;
    certPath: string;
    publicPath: string;
    config: NodeConfig & Config;
    _server?: Server;
    context: BaseContext & AlpContext;
    /**
     * @param {Object} [options]
     * @param {string} [options.certPath] directory of the ssl certificates
     * @param {string} [options.publicPath] directory of public files
     */
    constructor(options?: Options);
    existsConfigSync(name: string): boolean;
    loadConfigSync(name: string): Map<string, any>;
    get environment(): string;
    get production(): boolean;
    createContext<State = DefaultState, SanitizedState = DefaultState>(req: IncomingMessage, res: ServerResponse): Context<State, SanitizedState>;
    servePublic(): void;
    catchErrors(): void;
    listen(): Server;
    /**
     * Close server and emit close event
     */
    close(): void;
    start(fn: Function): Promise<Server>;
}
//# sourceMappingURL=index.d.ts.map