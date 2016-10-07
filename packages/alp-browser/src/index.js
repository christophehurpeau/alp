import Ibex from 'ibex';
import config from 'alp-config';
import errors from 'alp-errors-browser';
import params from 'alp-params';
import language from 'alp-language';
import translate from 'alp-translate';
import contentLoaded from 'content-loaded';
import { init as initWebApp, redirect } from 'alauda/src/web-app';
import Logger from 'nightingale-logger';

export { Config } from 'alp-config';
export { default as newController } from 'alp-controller';

const logger = new Logger('alp');

export default class AlpBrowser extends Ibex {
  path: string;
  appVersion: string;

  /**
   * @param {string} [path='/']
   * @param {Object} [options]
   */
  constructor(path = '/', options = {}) {
    super();
    this.path = path;

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
