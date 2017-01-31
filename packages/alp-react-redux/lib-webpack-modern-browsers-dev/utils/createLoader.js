import _t from "tcomb-forked";
/* global PRODUCTION */
export default function createLoader(handlers) {
  _assert(handlers, _t.maybe(_t.Object), "handlers");

  const handlerMap = new Map(Object.keys(handlers).map(function (key) {
    return [key, handlers[key]];
  }));
  handlers = undefined;

  return function (state, data) {
    const keys = Object.keys(data);
    return Promise.all(keys.map(function (key) {
      const handler = handlerMap.get(key);
      if (!handler) throw new Error(`Missing handler for "${key}".`);
      return handler(state, data[key]);
    })).then(function (results) {
      const data = Object.create(null);
      results.forEach(function (result, index) {
        data[keys[index]] = result;
      });
      return data;
    });
  };
}

function _assert(x, type, name) {
  if (_t.isType(type) && type.meta.kind !== 'struct') {
    if (!type.is(x)) {
      type(x, [name + ': ' + _t.getTypeName(type)]);
    }
  } else if (!(x instanceof type)) {
    _t.fail('Invalid value ' + _t.stringify(x) + ' supplied to ' + name + ' (expected a ' + _t.getTypeName(type) + ')');
  }

  return x;
}
//# sourceMappingURL=createLoader.js.map