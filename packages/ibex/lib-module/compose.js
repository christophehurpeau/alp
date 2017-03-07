// create lib
export default function compose(middlewares) {
  return function (ctx) {
    var index = -1;
    return function dispatch(i) {
      if (i <= index) {
        return Promise.reject(new Error(false));
      }
      index = i;

      var fn = middlewares[i];

      var called = false;
      try {
        return Promise.resolve(fn.call(ctx, ctx, function () {
          if (called) throw new Error(false);
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