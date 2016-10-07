function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

import Ibex from 'ibex';
import config from 'alp-config';
import errors from 'alp-errors-browser';
import params from 'alp-params';
import language from 'alp-language';
import translate from 'alp-translate';
import contentLoaded from 'content-loaded';
import { init as initWebApp, redirect } from 'alauda/web-app';
import Logger from 'nightingale-logger';

export { Config } from 'alp-config';
export { default as newController } from 'alp-controller';

var logger = new Logger('alp');

export default class AlpBrowser extends Ibex {

  /**
   * @param {string} [path='/']
   * @param {Object} [options]
   */
  constructor() {
    var path = arguments.length <= 0 || arguments[0] === undefined ? '/' : arguments[0];
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    super();
    this.path = path;

    if (global.initialBrowserContext) {
      this.context.state = global.initialBrowserContext.state;
    }
  }

  init() {
    var _this = this;

    return _asyncToGenerator(function* () {
      yield config('/config')(_this);
      params(_this);
      language(_this);
      yield translate('/locales')(_this);
    })();
  }

  get environment() {
    return this.env;
  }

  catchErrors() {
    this.use(errors);
  }

  initialRender(moduleDescriptor, data) {
    var context = Object.create(this.context);
    Object.assign(context, global.initialBrowserContext);
    delete context.state;

    return contentLoaded().then(() => context.render(moduleDescriptor, data, true)).then(() => {
      this.on('redirect', redirect);
      initWebApp(url => this.load(url));
    });
  }

  start(fn) {
    fn().then(() => logger.success('started')).catch(err => logger.error('start fail', { err }));
  }
}
//# sourceMappingURL=index.js.map