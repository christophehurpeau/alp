const proto = {};

const defineGetter = (target: string, name: string): void => {
  Object.defineProperty(proto, name, {
    get() {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      return this[target][name];
    },
  });
};

const defineAccess = (target: string, name: string): void => {
  Object.defineProperty(proto, name, {
    get() {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      return this[target][name];
    },
    set(value) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,  @typescript-eslint/no-unsafe-member-access
      this[target][name] = value;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return value;
    },
  });
};

const defineMethod = (target: string, name: string): void => {
  Object.defineProperty(proto, name, {
    value(...args: any[]) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
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

export default proto;
