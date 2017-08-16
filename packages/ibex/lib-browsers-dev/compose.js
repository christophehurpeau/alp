'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = compose;

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// create lib
function compose(middlewares) {
  var _middlewaresType = _flowRuntime2.default.array(_flowRuntime2.default.function());

  return _flowRuntime2.default.param('middlewares', _middlewaresType).assert(middlewares), function (ctx) {
    var index = -1;
    return function dispatch(i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'));
      index = i;


      var fn = middlewares[i];

      var called = false;
      try {
        return Promise.resolve(fn.call(ctx, ctx, function () {
          if (called) throw new Error('Cannot call next() more than once.');

          return called = true, dispatch(i + 1);
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    }(0);
  };
}
//# sourceMappingURL=compose.js.map