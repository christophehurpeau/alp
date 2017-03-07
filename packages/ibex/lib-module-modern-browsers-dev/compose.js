import t from 'flow-runtime';
// create lib
export default function compose(middlewares) {
  let _middlewaresType = t.array(t.function());

  t.param('middlewares', _middlewaresType).assert(middlewares);

  return function (ctx) {
    let index = -1;
    return function dispatch(i) {
      if (i <= index) {
        return Promise.reject(new Error('next() called multiple times'));
      }
      index = i;

      const fn = middlewares[i];

      let called = false;
      try {
        return Promise.resolve(fn.call(ctx, ctx, function () {
          if (called) throw new Error('Cannot call next() more than once.');
          called = true;
          return dispatch(i + 1);
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    }(0);
  };
}
//# sourceMappingURL=compose.js.map