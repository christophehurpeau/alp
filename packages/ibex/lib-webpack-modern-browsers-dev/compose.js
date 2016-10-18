import _t from 'tcomb-forked';
/* global PRODUCTION */
// create lib
export default function compose(middleware) {
  _assert(middleware, _t.list(_t.Function), 'middleware');

  return function (ctx) {
    var index = -1;
    return function dispatch(i) {
      if (i <= index) {
        return Promise.reject(new Error('next() called multiple times'));
      }
      index = i; //defines: #if !PRODUCTION = !false

      var fn = middleware[i];
      if (!fn) throw new Error(`Invalid fn ${ i }`);

      var called = false;
      try {
        return Promise.resolve(fn.call(ctx, ctx, () => {
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

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _t.stringify(x) + ' supplied to ' + name + ' (expected a ' + _t.getTypeName(type) + ')';
  }

  if (_t.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _t.getTypeName(type)]);

      _t.fail(message());
    }
  } else if (!(x instanceof type)) {
    _t.fail(message());
  }

  return x;
}
//# sourceMappingURL=compose.js.map