/// <reference types="node" />
import { EventEmitter } from 'events';
import { BaseContext } from 'koa';
import { Composed, Middleware as ComposeMiddleware } from './compose';
import { Request } from './request';
import { Response } from './response';
export interface Context extends BaseContext {
    app: Application;
    request: Request;
    response: Response;
    req: never;
    res: never;
    originalUrl: string;
    cookies: never;
    state: {
        [key: string]: any;
    };
    sanitizedState: {
        [key: string]: any;
    };
    respond?: boolean;
}
export declare type Middleware = ComposeMiddleware<Context>;
export default class Application extends EventEmitter {
    middleware: Middleware[];
    context: Context;
    callback?: Composed<Context>;
    constructor();
    readonly environment: void;
    use(fn: Middleware): this;
    onerror(e: any): void;
    run(url?: string): void;
    createContext(): any;
    load(url: string): Promise<boolean | void>;
}
//# sourceMappingURL=index.d.ts.map