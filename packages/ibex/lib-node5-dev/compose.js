'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = compose;
// create lib
function noop() {}

function compose(middleware) {
    return function (next) {
        next = next || noop;
        let i = middleware.length;
        while (i--) {
            next = wrap(middleware[i], this, next);
        }

        return next;
    };
}

/**
* Wrap a function, then lazily call it,
* always returning both a promise and a generator.
*
* @param {Function} fn
* @param {Object} ctx
* @param {Wrap} next
*/

function wrap(fn, ctx, next) {
    if (typeof fn !== 'function') {
        throw new TypeError('Not a function!');
    }

    try {
        return Promise.resolve(fn.call(ctx, ctx, next));
    } catch (e) {
        return Promise.reject(e);
    }
}
//# sourceMappingURL=compose.js.map