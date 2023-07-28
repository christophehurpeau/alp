import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import _config, { Config } from 'alp-node-config';
export { Config } from 'alp-node-config';
import { Logger } from 'nightingale-logger';
import { deprecate } from 'node:util';
import _listen from 'alp-listen';
import errors from 'alp-node-errors';
import language from 'alp-node-language';
import params from 'alp-params';
import translate from 'alp-translate';
import Koa from 'koa';
import compress from 'koa-compress';
import serve from 'koa-static';

const logger$1 = new Logger('alp');
class AlpNodeApp extends Koa {
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
    Object.defineProperty(this, 'packageDirname', {
      get: deprecate(() => packageDirname, 'packageDirname'),
      configurable: false,
      enumerable: false
    });
    this.certPath = certPath || `${packageDirname}/config/cert`;
    this.publicPath = publicPath || `${packageDirname}/public/`;
    this.config = _config(this, config);
    this.context.config = this.config;
    params(this);
    language(this);
    translate('locales')(this);
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
    this.use(serve(this.publicPath)); // static files
  }

  catchErrors() {
    this.use(errors);
  }
  listen() {
    throw new Error('Use start instead');
  }

  /**
   * Close server and emit close event
   */
  close() {
    if (this._server) {
      this._server.close();
      this.emit('close');
    }
  }
  async start(fn) {
    await fn();
    try {
      const server = await _listen(this.config, this.callback(), this.certPath);
      this._server = server;
      logger$1.success('started');
      if (process.send) process.send('ready');
      return server;
    } catch (error) {
      logger$1.error('start fail', {
        err: error
      });
      throw error;
    }
  }
}

const logger = new Logger('alp');
const appDirname = path.resolve('build');
const packagePath = path.resolve('package.json');
if (!packagePath) {
  throw new Error(`Could not find package.json: "${String(packagePath)}"`);
}
const packageDirname = path.dirname(packagePath);
logger.debug('init', {
  appDirname,
  packageDirname
});
const packageConfig = JSON.parse(readFileSync(packagePath, 'utf8'));
const buildedConfigPath = `${appDirname}/build/config/`;
const configPath = existsSync(buildedConfigPath) ? buildedConfigPath : `${appDirname}/config/`;
const config = new Config(configPath).loadSync({
  packageConfig
});
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

export { appDirname, config, App as default, packageConfig, packageDirname };
//# sourceMappingURL=index-node18.mjs.map