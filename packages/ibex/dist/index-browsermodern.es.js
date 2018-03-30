import delegate from 'delegates';
import { parse } from 'querystring';
import { EventEmitter } from 'events';
import Logger from 'nightingale-logger';

// create lib
function compose(middlewares) {
  return function (ctx) {
    let index = -1;
    return function dispatch(i) {
      if (i <= index) {
        return Promise.reject(new Error(false));
      }
      index = i;

      const fn = middlewares[i];

      let called = false;
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

const proto = {};

delegate(proto, 'response').access('body').method('redirect');

delegate(proto, 'request').getter('host').getter('hostname').getter('href').getter('origin').getter('path').getter('protocol').getter('query').getter('url').getter('search').getter('searchParams');

var request = {
  get search() {
    return window.location.search;
  },
  get path() {
    return window.location.pathname;
  },
  get port() {
    return window.location.port;
  },
  get url() {
    return window.location.url;
  },
  get origin() {
    return window.location.origin;
  },
  get protocol() {
    return window.location.protocol;
  },
  get query() {
    return parse(window.location.search);
  },
  get searchParams() {
    return new URLSearchParams(window.location.search.length === 0 ? window.location.search : window.location.search.substr(1));
  },
  get href() {
    return window.location.href;
  },
  get host() {
    return window.location.host;
  },
  get hostname() {
    return window.location.hostname;
  }
};

var response = {
  redirect(url) {
    if (this.app.emit('redirect', url) === false) {
      window.location.href = url;
    }
  }
};

const logger = new Logger('ibex');

function respond(ctx) {
  // allow bypassing
  if (ctx.respond === false) {
    return;
  }

  const body = ctx.body;
  if (body == null) return;

  // const code = ctx.status;

  if (typeof body === 'string') {
    document.body.innerHTML = body;
    return;
  }

  if (body.nodeType) {
    document.body.innerHTML = '';
    document.body.appendChild(body);
  }

  throw new Error('Invalid body result');
}

let Application = class extends EventEmitter {

  constructor() {
    super();
    this.middleware = [];
    this.context = Object.create(proto);
    this.context.app = this;
    this.context.state = {};
  }

  get environment() {
    return this.env;
  }

  use(fn) {
    logger.debug('use', { name: fn.name || '-' });
    this.middleware.push(fn);
    return this;
  }

  onerror(e) {
    logger.error(e);
  }

  run(url) {
    if (!this.listeners('error').length) {
      this.on('error', this.onerror);
    }

    this.callback = compose(this.middleware);

    if (url) {
      this.load(url);
    }
  }

  createContext() {
    const context = Object.create(this.context);
    context.request = Object.create(request);
    context.response = Object.create(response);
    // eslint-disable-next-line no-multi-assign
    context.request.app = context.response.app = this;
    return context;
  }

  load(url) {
    var _this = this;

    logger.debug('load', { url });

    if (url.startsWith('?')) {
      url = window.location.pathname + url;
    }

    const context = this.createContext();
    return this.callback(context).then(function () {
      return respond(context);
    }).catch(function (err) {
      return _this.emit('error', err);
    });
  }
};

export default Application;
//# sourceMappingURL=index-browsermodern.es.js.map
