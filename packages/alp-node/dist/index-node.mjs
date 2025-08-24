import { unlinkSync, chmodSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { Logger } from 'nightingale-logger';
import Koa from 'koa';
import compress from 'koa-compress';
import serve from 'koa-static';
import { STATUS_CODES, createServer as createServer$2 } from 'node:http';
import ErrorHtmlRenderer from 'error-html';
import { defineLazyProperty } from 'object-properties';
import { createServer as createServer$1 } from 'node:https';
import IntlMessageFormatDefault from 'intl-messageformat';
import deepFreeze from 'deep-freeze-es6';
import minimist from 'minimist';
import { createRouterBuilder } from 'router-segments';

const logger$4 = new Logger("alp:errors");
const errorHtmlRenderer = new ErrorHtmlRenderer({
  appPath: `${process.cwd()}/`
});
async function alpNodeErrors(ctx, next) {
  try {
    await next();
  } catch (error) {
    if (!error) error = new Error("Unknown error");
    if (typeof error === "string") error = new Error(error);
    ctx.status = error.status || 500;
    logger$4.error(error);
    switch (ctx.request.accepts("html", "text", "json")) {
      case "json":
        ctx.type = "application/json";
        if (process.env.NODE_ENV !== "production" || error.expose) {
          ctx.body = { error: error.message };
        } else {
          ctx.body = { error: STATUS_CODES[ctx.status] };
        }
        break;
      case "html":
        ctx.type = "text/html";
        if (process.env.NODE_ENV !== "production") {
          ctx.body = errorHtmlRenderer.render(error);
        } else if (error.expose) {
          ctx.body = error.message;
        } else {
          throw error;
        }
        break;
      case "text":
      case false:
      default:
        ctx.type = "text/plain";
        if (process.env.NODE_ENV !== "production" || error.expose) {
          ctx.body = error.message;
        } else {
          throw error;
        }
        break;
    }
  }
}

function alpLanguage(app) {
  const config = app.context.config;
  const availableLanguages = config.get("availableLanguages");
  if (!availableLanguages) {
    throw new Error('Missing config "availableLanguages"');
  }
  defineLazyProperty(
    app.context,
    "language",
    function language() {
      return this.acceptsLanguages(availableLanguages) || availableLanguages[0] || "en";
    }
  );
  defineLazyProperty(
    app.context,
    "firstAcceptedLanguage",
    function firstAcceptedLanguage() {
      return this.acceptsLanguages()[0] || availableLanguages[0] || "en";
    }
  );
}

const logger$3 = new Logger("alp:listen");
const createServer = (callback, socketPath, tls, dirname = "") => {
  const createHttpServer = !socketPath && tls ? createServer$1 : createServer$2;
  if (!tls) {
    return createHttpServer(callback);
  }
  const options = {
    key: readFileSync(`${dirname}/server.key`),
    cert: readFileSync(`${dirname}/server.crt`)
  };
  return createHttpServer(options, callback);
};
function alpListen(config, callback, dirname) {
  return new Promise((resolve) => {
    const socketPath = config.get("socketPath");
    const port = config.get("port");
    const hostname = config.get("hostname");
    const tls = config.get("tls");
    logger$3.info("Creating server", socketPath ? { socketPath } : { port });
    const server = createServer(callback, socketPath, tls, dirname);
    if (socketPath) {
      try {
        unlinkSync(socketPath);
      } catch {
      }
      server.listen(socketPath, () => {
        if (socketPath) {
          chmodSync(socketPath, "777");
        }
        logger$3.info("Server listening", { socketPath });
        resolve(server);
      });
    } else {
      server.listen(port, hostname, () => {
        logger$3.info("Server listening", { port });
        resolve(server);
      });
    }
  });
}

class ParamValidationResult {
  _errors;
  _error(name, key, value) {
    if (!this._errors) {
      this._errors = {};
    }
    this._errors[name] = { error: key, value };
  }
  getErrors() {
    return this._errors;
  }
  hasErrors() {
    return this._errors !== void 0;
  }
  isValid() {
    return this._errors === void 0;
  }
  // string(name: string): ParamValueStringValidator {
  //   return new ParamValueStringValidator(this, name, this.context.param(name));
  // }
  /* int(name, position) {
   return new ParamValueIntValidator(this, name, this.context.param(name, position));
   }
   model(modelName, name) {
   name = name || S.string.lcFirst(modelName);
   console.log('paramvalidator model', modelName, M[modelName]);
   let data = this.context.getOrPostParam(name);
   return new ParamValueModelValidator(this, name, !data ? null : new M[modelName](data));
   } */
}

class ParamValid extends ParamValidationResult {
  context;
  constructor(context) {
    super();
    this.context = context;
  }
  _error() {
    this.context.throw(400, "Invalid params", { validator: this });
  }
}

class ParamValueValidator {
  validationResult;
  name;
  value;
  constructor(validationResult, name, value) {
    this.validationResult = validationResult;
    this.name = name;
    this.value = value;
  }
  isValid() {
    return this.validationResult.isValid();
  }
  _error(key) {
    this.validationResult._error(this.name, key, this.value);
  }
}

class ParamValueStringValidator extends ParamValueValidator {
  notEmpty() {
    if (this.value == null || this.value.trim() === "") {
      this._error("notEmpty");
    }
    return this;
  }
}

class ParamValueFromContext {
  validationResult;
  context;
  constructor(context, validationResult) {
    this.validationResult = validationResult;
    this.context = context;
  }
  namedParam(name) {
    return new ParamValueStringValidator(
      this.validationResult,
      name,
      this.context.namedRouteParam(name)
    );
  }
  otherParam(position) {
    return new ParamValueStringValidator(
      this.validationResult,
      String(position),
      this.context.otherRouteParam(position)
    );
  }
  queryParam(name) {
    return new ParamValueStringValidator(
      this.validationResult,
      name,
      this.context.queryParam(name)
    );
  }
  // bodyParam: <T>(name: string): ParamValueValidator<string | undefined> {
  // }
}

function alpParams(app) {
  Object.assign(app.context, {
    namedRouteParam(name) {
      const namedParams = this.route.namedParams;
      return namedParams?.get(name);
    },
    otherRouteParam(position) {
      const otherParams = this.route.otherParams;
      return otherParams?.[position - 1];
    },
    queryParam(name) {
      const searchParams = this.request.searchParams;
      return searchParams.get(name) ?? void 0;
    },
    bodyParam(name) {
      return this.body[name];
    }
  });
  defineLazyProperty(
    app.request,
    "searchParams",
    function searchParams() {
      return new URLSearchParams(this.search);
    }
  );
  defineLazyProperty(
    app.context,
    "params",
    function params() {
      return new ParamValueFromContext(this, new ParamValidationResult());
    }
  );
  defineLazyProperty(
    app.context,
    "validParams",
    function validParams() {
      return new ParamValueFromContext(this, new ParamValid(this));
    }
  );
}

const IntlMessageFormat = (
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  IntlMessageFormatDefault.default || IntlMessageFormatDefault
);
function load(translations, language) {
  const result = {};
  (function loadMap(record, prefix) {
    Object.entries(record).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        loadMap(value, `${prefix}${key}.`);
        return;
      }
      result[`${prefix}${key}`] = new IntlMessageFormat(
        value,
        language
      );
    });
  })(translations, "");
  return result;
}

const logger$2 = new Logger("alp:translate");
function alpTranslate(dirname) {
  dirname = dirname.replace(/\/*$/, "/");
  return (app) => {
    const appTranslations = /* @__PURE__ */ new Map();
    Object.assign(app.context, {
      t(id, args) {
        const msg = appTranslations.get(this.language)?.[id];
        if (!msg) {
          logger$2.warn("invalid msg", { language: this.language, id });
          return id;
        }
        return msg.format(args);
      }
    });
    const config = app.config;
    config.get("availableLanguages").forEach((language) => {
      const translations = app.loadConfigSync(dirname + language);
      appTranslations.set(language, load(translations, language));
    });
    return appTranslations;
  };
}

const logger$1 = new Logger("alp");
class AlpNodeApp extends Koa {
  dirname;
  certPath;
  publicPath;
  config;
  _server;
  router;
  /**
   * @param {Object} [options]
   * @param {string} [options.certPath] directory of the ssl certificates
   * @param {string} [options.publicPath] directory of public files
   */
  constructor({
    appDirname,
    packageDirname,
    config,
    certPath,
    publicPath
  }) {
    super();
    this.dirname = path.normalize(appDirname);
    this.certPath = certPath || `${packageDirname}/config/cert`;
    this.publicPath = publicPath || `${packageDirname}/public/`;
    this.config = config;
    this.context.config = this.config;
    alpParams(this);
    alpLanguage(this);
    alpTranslate("locales")(this);
    this.use(compress());
  }
  existsConfigSync(name) {
    return this.config.existsConfigSync(name);
  }
  loadConfigSync(name) {
    return this.config.loadConfigSync(name);
  }
  createContext(req, res) {
    const ctx = super.createContext(req, res);
    ctx.sanitizedState = {};
    return ctx;
  }
  servePublic() {
    this.use(serve(this.publicPath));
  }
  catchErrors() {
    this.use(alpNodeErrors);
  }
  listen() {
    throw new Error("Use start instead");
  }
  /**
   * Close server and emit close event
   */
  close() {
    if (this._server) {
      this._server.close();
      this.emit("close");
    }
  }
  async start(fn) {
    await fn();
    try {
      const server = await alpListen(
        this.config,
        this.callback(),
        this.certPath
      );
      this._server = server;
      logger$1.success("started");
      if (process.send) process.send("ready");
      return server;
    } catch (error) {
      logger$1.error("start fail", { err: error });
      throw error;
    }
  }
}

const argv = minimist(process.argv.slice(2));
function _existsConfigSync(dirname, name) {
  return existsSync(`${dirname}${name}.json`);
}
function _loadConfigSync(dirname, name) {
  const content = readFileSync(`${dirname}${name}.json`, "utf8");
  return JSON.parse(content);
}
class Config {
  packageConfig;
  _record;
  _dirname;
  constructor(dirname, options) {
    this._record = {};
    this._dirname = dirname.replace(/\/*$/, "/");
    if (options) {
      this.loadSync(options);
    }
  }
  loadSync(options = {}) {
    const env = process.env.CONFIG_ENV || process.env.NODE_ENV || "development";
    const { argv: argvOverrides = [], packageConfig, version } = options;
    this.packageConfig = packageConfig;
    const config = _loadConfigSync(this._dirname, "common");
    for (const [key, value] of Object.entries(
      _loadConfigSync(this._dirname, env)
    )) {
      config[key] = value;
    }
    if (this.existsConfigSync("local")) {
      for (const [key, value] of Object.entries(
        _loadConfigSync(this._dirname, "local")
      )) {
        config[key] = value;
      }
    }
    if (config.version) {
      throw new Error('Cannot have "version", in config.');
    }
    config.version = String(version || argv.version || packageConfig?.version);
    const socketPath = argv.socket || argv["socket-path"] || argv.socketPath;
    if (socketPath) {
      config.socketPath = socketPath;
    } else if (argv.port) {
      config.port = argv.port;
      delete config.socketPath;
    } else if (process.env.PORT) {
      config.port = Number(process.env.PORT);
      delete config.socketPath;
    }
    argvOverrides.forEach((key) => {
      const splitted = key.split(".");
      const value = splitted.length > 0 && // eslint-disable-next-line @typescript-eslint/no-unsafe-return,unicorn/no-array-reduce
      splitted.reduce((config2, partialKey) => config2[partialKey], argv);
      if (value !== void 0) {
        const last = splitted.pop();
        const v = splitted.length === 0 ? config : (
          // eslint-disable-next-line unicorn/no-array-reduce
          splitted.reduce(
            (config2, partialKey) => config2[partialKey],
            config
          )
        );
        v[last] = value;
      }
    });
    this._record = deepFreeze(config);
    return this;
  }
  get(key) {
    return this._record[key];
  }
  existsConfigSync(name) {
    return _existsConfigSync(this._dirname, name);
  }
  loadConfigSync(name) {
    return _loadConfigSync(this._dirname, name);
  }
}

const createAlpRouterBuilder = () => createRouterBuilder();
function alpRouter(router) {
  return (app) => {
    app.router = router;
    app.context.urlGenerator = function urlGenerator(routeKey, params) {
      return router.toLocalizedPath(this.language, routeKey, params);
    };
    app.context.redirectTo = function redirectTo(to, params) {
      this.redirect(
        router.toLocalizedPath(this.language, to, params)
      );
    };
    return async (ctx) => {
      const routeMatch = router.find(ctx.request.path, ctx.language);
      if (!routeMatch) {
        ctx.status = 404;
        throw new Error(`Route not found: ${ctx.request.path}`);
      }
      ctx.route = routeMatch;
      await routeMatch.ref(ctx);
    };
  };
}

const logger = new Logger("alp");
const appDirname = path.resolve("build");
const packagePath = path.resolve("package.json");
if (!packagePath) {
  throw new Error(`Could not find package.json: "${String(packagePath)}"`);
}
const packageDirname = path.dirname(packagePath);
logger.debug("init", { appDirname, packageDirname });
const packageConfig = JSON.parse(
  readFileSync(packagePath, "utf8")
);
const buildedConfigPath = `${appDirname}/build/config/`;
const configPath = existsSync(buildedConfigPath) ? buildedConfigPath : `${appDirname}/config/`;
const config = new Config(configPath).loadSync({ packageConfig });
class App extends AlpNodeApp {
  constructor(options) {
    super({
      ...options,
      appDirname,
      packageDirname,
      config
    });
  }
}

export { Config, appDirname, config, createAlpRouterBuilder, App as default, packageConfig, packageDirname, alpRouter as router };
//# sourceMappingURL=index-node.mjs.map
