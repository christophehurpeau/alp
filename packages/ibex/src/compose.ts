import { PRODUCTION } from 'pob-babel';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  Middleware as ComposeMiddleware,
  ComposedMiddleware,
} from 'koa-compose';

export type Composed<Context> = ComposedMiddleware<Context>;
export type Middleware<Context> = ComposeMiddleware<Context>;

// TODO create lib
export default function compose<Context>(
  middlewares: Array<Middleware<Context>>,
): Composed<Context> {
  return function(ctx: Context): Promise<any> {
    let index = -1;
    return (function dispatch(i: number): Promise<any> {
      if (i <= index) {
        return Promise.reject(
          new Error(PRODUCTION ? undefined : 'next() called multiple times'),
        );
      }
      index = i;

      const fn = middlewares[i];

      let called = false;
      try {
        return Promise.resolve(
          fn.call(
            ctx,
            ctx,
            (): Promise<any> => {
              if (called) {
                throw new Error(
                  PRODUCTION ? undefined : 'Cannot call next() more than once.',
                );
              }
              called = true;
              return dispatch(i + 1);
            },
          ),
        );
      } catch (err) {
        return Promise.reject(err);
      }
    })(0);
  };
}
