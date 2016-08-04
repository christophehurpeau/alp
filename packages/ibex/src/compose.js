// create lib
export default function compose(middleware) {
    return function (ctx, next) {
        return (function dispatch(i) {
            const fn = middleware[i] || next;
            let called = false;
            try {
                return Promise.resolve(fn.call(ctx, ctx, () => {
                    if (called) throw new Error('Cannot call next() more than once.');
                    called = true;
                    return dispatch(i + 1);
                }));
            } catch (e) {
                return Promise.reject(e);
            }
        }(0));
    };
}
