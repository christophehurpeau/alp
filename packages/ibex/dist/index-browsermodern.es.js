import { EventEmitter } from 'events';
import { Logger } from 'nightingale-logger';

// TODO create lib
function compose(middlewares) {
  return function (ctx) {
    let index = -1;
    return function dispatch(i) {
      if (i <= index) {
        return Promise.reject(new Error(!(process.env.NODE_ENV !== "production") ? undefined : 'next() called multiple times'));
      }

      index = i;
      const fn = middlewares[i];
      let called = false;

      try {
        return Promise.resolve(fn.call(ctx, ctx, () => {
          if (called) {
            throw new Error(!(process.env.NODE_ENV !== "production") ? undefined : 'Cannot call next() more than once.');
          }

          called = true;
          return dispatch(i + 1);
        }));
      } catch (err) {
        return Promise.reject(err);
      }
    }(0);
  };
}

const proto = {};

const defineGetter = (target, name) => {
  Object.defineProperty(proto, name, {
    get() {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      return this[target][name];
    }

  });
};

const defineAccess = (target, name) => {
  Object.defineProperty(proto, name, {
    get() {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      return this[target][name];
    },

    set(value) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,  @typescript-eslint/no-unsafe-member-access
      this[target][name] = value; // eslint-disable-next-line @typescript-eslint/no-unsafe-return

      return value;
    }

  });
};

const defineMethod = (target, name) => {
  Object.defineProperty(proto, name, {
    value(...args) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      return this[target][name].call(this[target], ...args);
    }

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
const context = proto;

const request = {
  get search() {
    return window.location.search;
  },

  get path() {
    return window.location.pathname;
  },

  get url() {
    return window.location.pathname + window.location.search;
  },

  get origin() {
    return window.location.origin;
  },

  get protocol() {
    return window.location.protocol;
  },

  get query() {
    throw new Error('Use searchParams instead.');
  },

  get querystring() {
    return window.location.search;
  },

  get searchParams() {
    return new URLSearchParams(window.location.search.length === 0 ? window.location.search : window.location.search.slice(1));
  },

  get href() {
    return window.location.href;
  },

  get host() {
    return window.location.host;
  },

  get hostname() {
    return window.location.hostname;
  },

  get headers() {
    throw new Error('Headers not available in ibex request.');
  },

  get accepts() {
    throw new Error('Not implemented.');
  },

  get acceptsLanguages() {
    throw new Error('Not implemented.');
  }

};
const request$1 = request;

const response = {
  redirect(url) {
    if (!this.app.emit('redirect', url)) {
      window.location.href = url;
      return new Promise(() => {// promise that never resolves.
      });
    }

    return Promise.resolve();
  }

};
const response$1 = response;

const logger = new Logger('ibex');

function respond(ctx) {
  // allow bypassing
  if (ctx.respond === false) {
    return;
  }

  const body = ctx.body;
  if (body == null) return; // const code = ctx.status;

  if (typeof body === 'string') {
    document.body.innerHTML = body;
    return;
  }

  if (body.nodeType) {
    document.body.innerHTML = '';
    document.body.append(body);
  }

  throw new Error('Invalid body result');
}

class Application extends EventEmitter {
  middleware = [];
  context = Object.create(context);

  constructor() {
    super();
    this.context.app = this;
  }

  use(fn) {
    logger.debug('use', {
      name: fn.name || '-'
    });
    this.middleware.push(fn);
    return this;
  }

  onerror(e) {
    logger.error(e);
  }

  run(url) {
    if (this.listeners('error').length === 0) {
      this.on('error', this.onerror);
    }

    this.callback = compose(this.middleware);

    if (url) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.load(url);
    }
  }

  createContext() {
    const ctx = Object.create(this.context);
    ctx.request = Object.create(request$1);
    ctx.response = Object.create(response$1);
    Object.assign(ctx.request, {
      app: this
    });
    Object.assign(ctx.response, {
      app: this
    });
    ctx.state = {};
    ctx.sanitizedState = {};
    return ctx;
  }

  load(url) {
    logger.debug('load', {
      url
    });

    if (url.startsWith('?')) {
      url = window.location.pathname + url;
    }

    if (!this.callback) {
      throw new Error('You should call load() after run()');
    }

    const ctx = this.createContext();
    return this.callback(ctx).then(() => {
      respond(ctx);
    }).catch(err => {
      this.emit('error', err);
    });
  }

}

export { Application as default };
//# sourceMappingURL=index-browsermodern.es.js.map
