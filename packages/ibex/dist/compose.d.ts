import { Middleware as ComposeMiddleware, ComposedMiddleware } from 'koa-compose';
export declare type Composed<Context> = ComposedMiddleware<Context>;
export declare type Middleware<Context> = ComposeMiddleware<Context>;
export default function compose<Context>(middlewares: Array<Middleware<Context>>): Composed<Context>;
//# sourceMappingURL=compose.d.ts.map