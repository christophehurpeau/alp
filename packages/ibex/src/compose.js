/* global PRODUCTION */
// create lib
export default function compose(middleware: Array<Function>) {
    return function (ctx) {
        let index = -1;
        return (function dispatch(i) {
            if (i <= index) {
                return Promise.reject(new Error(!PRODUCTION && 'next() called multiple times'));
            }
            index = i; // #if !PRODUCTION

            const fn = middleware[i];
            if (!PRODUCTION && !fn) throw new Error(!PRODUCTION && `Invalid fn ${i}`);

            let called = false;
            try {
                return Promise.resolve(fn.call(ctx, ctx, () => {
                    if (called) throw new Error(!PRODUCTION && 'Cannot call next() more than once.');
                    called = true;
                    return dispatch(i + 1);
                }));
            } catch (e) {
                return Promise.reject(e);
            }
        }(0));
    };
}
