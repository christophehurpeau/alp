function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* global window */
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

const logger = new Logger('alp');

let AlpBrowser = class extends Ibex {

  constructor(path = '/', { version = window.VERSION } = {}) {
    super();
    this.path = path;
    this.appVersion = window.VERSION;

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
    var _this2 = this;

    const context = Object.create(this.context);
    Object.assign(context, global.initialBrowserContext);
    delete context.state;

    return contentLoaded().then(function () {
      return context.render(moduleDescriptor, data, true);
    }).then(function () {
      _this2.on('redirect', redirect);
      initWebApp(function (url) {
        return _this2.load(url);
      });
    });
  }

  start(fn) {
    fn().then(function () {
      return logger.success('started');
    }).catch(function (err) {
      return logger.error('start fail', { err });
    });
  }
};
export { AlpBrowser as default };
//# sourceMappingURL=index.js.map