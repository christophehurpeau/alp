/* global window */
import Ibex from 'ibex/src';
import config from 'alp-config/src';
import errors from 'alp-errors-browser/src';
import params from 'alp-params/src';
import language from 'alp-language/src';
import translate from 'alp-translate/src';
import contentLoaded from 'content-loaded';
import { init as initWebApp, redirect } from 'alauda/src/web-app';
import Logger from 'nightingale-logger/src';

export { Config } from 'alp-config/src';
export { default as newController } from 'alp-controller/src';

const logger = new Logger('alp');

type OptionsType = {
  version: ?string, // default to window.VERSION
};

export default class AlpBrowser extends Ibex {
  path: string;
  appVersion: string;

  constructor(path = '/', { version = window.VERSION }: OptionsType = {}) {
    super();
    this.path = path;
    this.appVersion = window.VERSION;

    if (global.initialBrowserContext) {
      this.context.state = global.initialBrowserContext.state;
    }
  }

  async init() {
    await config('/config')(this);
    params(this);
    language(this);
    await translate('/locales')(this);
  }

  get environment() {
    return this.env;
  }

  catchErrors() {
    this.use(errors);
  }

  initialRender(moduleDescriptor, data) {
    const context = Object.create(this.context);
    Object.assign(context, global.initialBrowserContext);
    delete context.state;

    return contentLoaded()
      .then(() => (
        context.render(moduleDescriptor, data, true)
      )).then(() => {
        this.on('redirect', redirect);
        initWebApp(url => this.load(url));
      });
  }

  start(fn: Function) {
    fn()
      .then(() => logger.success('started'))
      .catch(err => logger.error('start fail', { err }));
  }
}
