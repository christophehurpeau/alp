/// <reference types="node" />
import { EventEmitter } from 'events';
import type { BaseContext as KoaBaseContext } from 'koa';
import type { Composed, Middleware as ComposeMiddleware } from './compose';
import type { Request } from './request';
import type { Response } from './response';
export interface BaseContext extends KoaBaseContext {
    app: Application;
    redirect: (url: string) => Promise<void>;
}
export interface DefaultState {
}
export interface DefaultSanitizedState {
}
export interface Context extends BaseContext {
    request: Request;
    response: Response;
    req: never;
    res: never;
    originalUrl: string;
    cookies: never;
    state: DefaultState;
    sanitizedState: DefaultSanitizedState;
    respond?: boolean;
}
export declare type Middleware = ComposeMiddleware<Context>;
export default class Application extends EventEmitter {
    middleware: Middleware[];
    context: BaseContext;
    callback?: Composed<Context>;
    constructor();
    use(fn: Middleware): this;
    onerror(e: any): void;
    run(url?: string): void;
    createContext(): Context;
    load(url: string): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map