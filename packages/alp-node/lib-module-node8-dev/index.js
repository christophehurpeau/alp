var _dec, _dec2, _desc, _value, _class, _descriptor, _descriptor2;

function _initDefineProp(target, property, descriptor, context) {
  descriptor && Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  return Object['keys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  }), desc.enumerable = !!desc.enumerable, desc.configurable = !!desc.configurable, ('value' in desc || desc.initializer) && (desc.writable = true), desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc), context && desc.initializer !== void 0 && (desc.value = desc.initializer ? desc.initializer.call(context) : void 0, desc.initializer = void 0), desc.initializer === void 0 && (Object['defineProperty'](target, property, desc), desc = null), desc;
}

function _initializerWarningHelper() {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

import { existsSync } from 'fs';
import path from 'path';
import { deprecate } from 'util';
import Koa from 'koa';
import compress from 'koa-compress';
import serve from 'koa-static';
import _config, { Config } from 'alp-config';
import errors from 'alp-errors-node';
import params from 'alp-params';
import language from 'alp-language';
import translate from 'alp-translate';
import _listen from 'alp-listen';
import Logger from 'nightingale-logger';
import findUp from 'findup-sync';

import t from 'flow-runtime';
export { Config } from 'alp-config';

const logger = new Logger('alp');

export const appDirname = path.dirname(process.argv[1]);

const packagePath = findUp('package.json', { cwd: appDirname });
if (!packagePath) throw new Error(`Could not find package.json: "${packagePath}"`);
export const packageDirname = path.dirname(packagePath);

logger.debug('init', { appDirname, packageDirname });


// eslint-disable-next-line import/no-dynamic-require, global-require
export const packageConfig = require(packagePath);

const buildedConfigPath = `${appDirname}/build/config/`;
const configPath = existsSync(buildedConfigPath) ? buildedConfigPath : `${appDirname}/config/`;
export const config = new Config(configPath);
config.loadSync({ packageConfig });
let Alp = (_dec = t.decorate(t.string()), _dec2 = t.decorate(t.string()), _class = class extends Koa {

  /**
   * @param {Object} [options]
   * @param {string} [options.dirname] directory of the application
   * @param {string} [options.certPath] directory of the ssl certificates
   * @param {string} [options.publicPath] directory of public files
   * @param {Config} [options.config] alp-config object
   * @param {Array} [options.argv] deprecated, list of overridable config by argv
   */
  constructor(options = {}) {
    if (super(), _initDefineProp(this, 'dirname', _descriptor, this), _initDefineProp(this, 'packageDirname', _descriptor2, this), options.packageDirname) throw new Error('options.packageDirname is deprecated');
    if (options.config) throw new Error('options.config is deprecated');
    if (options.srcDirname) throw new Error('options.srcDirname is deprecated');
    if (options.dirname) throw new Error('options.dirname is deprecated');

    this.dirname = path.normalize(appDirname), Object.defineProperty(this, 'packageDirname', {
      get: deprecate(() => packageDirname, 'packageDirname'),
      configurable: false,
      enumerable: false
    }), this.certPath = options.certPath || `${packageDirname}/config/cert`, this.publicPath = options.publicPath || `${packageDirname}/public/`, _config()(this, config), params(this), language(this), translate('locales')(this), this.use(compress());
  }

  get environment() {
    return deprecate(() => () => null, 'app.environment, use app.env instead')(), this.env;
  }

  get production() {
    return deprecate(() => () => null, 'app.production, use global.PRODUCTION instead')(), this.env === 'prod' || this.env === 'production';
  }
  servePublic() {
    this.use(serve(this.publicPath));
  }

  catchErrors() {
    this.use(errors);
  }

  listen() {
    return _listen(this.certPath)(this).then(server => this._server = server).catch(err => {
      throw logger.error(err), err;
    });
  }

  /**
   * Close server and emit close event
   */
  close() {
    this._server && (this._server.close(), this.emit('close'));
  }

  start(fn) {
    let _fnType = t.function();

    t.param('fn', _fnType).assert(fn), fn().then(() => logger.success('started')).catch(err => logger.error('start fail', { err }));
  }
}, _descriptor = _applyDecoratedDescriptor(_class.prototype, 'dirname', [_dec], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'packageDirname', [_dec2], {
  enumerable: true,
  initializer: null
}), _class);
export { Alp as default };
//# sourceMappingURL=index.js.map