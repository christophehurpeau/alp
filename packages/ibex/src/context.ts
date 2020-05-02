const proto = {};

const defineGetter = (target: string, name: string) => {
  Object.defineProperty(proto, name, {
    get() {
      return this[target][name];
    },
  });
};

const defineAccess = (target: string, name: string) => {
  Object.defineProperty(proto, name, {
    get() {
      return this[target][name];
    },
    set(value) {
      this[target][name] = value;
      return value;
    },
  });
};

const defineMethod = (target: string, name: string) => {
  Object.defineProperty(proto, name, {
    value(...args: any[]) {
      return this[target][name].call(this[target], ...args);
    },
  });
};

defineAccess('response', 'body');
defineMethod('response', 'redirect');

defineGetter('request', 'host');
defineGetter('request', 'hostname');
defineGetter('request', 'href');
defineGetter('request', 'origin');
defineGetter('request', 'path');
defineGetter('request', 'protocol');
defineGetter('request', 'query');
defineGetter('request', 'url');
defineGetter('request', 'search');
defineGetter('request', 'searchParams');

export default proto;
