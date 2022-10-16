import path from 'path';
import { deprecate } from 'util';
import _listen from 'alp-listen';
import _config from 'alp-node-config';
import errors from 'alp-node-errors';
import language from 'alp-node-language';
import params from 'alp-params';
import translate from 'alp-translate';
import Koa from 'koa';
import compress from 'koa-compress';
import serve from 'koa-static';
import { Logger } from 'nightingale-logger';

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

export { AlpNodeApp };
//# sourceMappingURL=AlpNodeApp-node14.mjs.map
