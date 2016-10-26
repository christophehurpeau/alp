'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = compose;
// create lib
function compose(middleware) {
  return function (ctx) {
    var index = -1;
    return function dispatch(i) {
      if (i <= index) {
        return Promise.reject(new Error(false));
      }
      index = i;

      var fn = middleware[i];


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