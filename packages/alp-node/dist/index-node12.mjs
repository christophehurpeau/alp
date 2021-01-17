import { readFileSync, existsSync } from 'fs';
import path from 'path';
import _config, { Config } from 'alp-node-config';
export { Config } from 'alp-node-config';
import findUp from 'findup-sync';
import Logger from 'nightingale-logger';
import { deprecate } from 'util';
import _listen from 'alp-listen';
import errors from 'alp-node-errors';
import language from 'alp-node-language';
import params from 'alp-params';
import translate from 'alp-translate';
import Koa from 'koa';
import compress from 'koa-compress';
import serve from 'koa-static';

const logger = new Logger('alp');
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
      logger.success('started');
      if (process.send) process.send('ready');
      return server;
    } catch (err) {
      logger.error('start fail', {
        err
      });
      throw err;
    }
  }

}

const logger$1 = new Logger('alp'); // see alp-dev

const appDirname = path.resolve('build');
const packagePath = findUp('package.json', {
  cwd: appDirname
});

if (!packagePath) {
  throw new Error(`Could not find package.json: "${String(packagePath)}"`);
}

const packageDirname = path.dirname(packagePath);
logger$1.debug('init', {
  appDirname,
  packageDirname
});
const packageConfig = JSON.parse(readFileSync(packagePath, 'utf-8'));
const buildedConfigPath = `${appDirname}/build/config/`;
const configPath = existsSync(buildedConfigPath) ? buildedConfigPath : `${appDirname}/config/`;
const config = new Config(configPath).loadSync({
  packageConfig
});
class App extends AlpNodeApp {
  constructor(options) {
    super({ ...options,
      appDirname,
      packageDirname,
      config
    });
  }

}

export default App;
export { appDirname, config, packageConfig, packageDirname };
//# sourceMappingURL=index-node12.mjs.map
