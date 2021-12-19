import config, { existsConfig, getConfig } from 'alp-browser-config';
import language from 'alp-browser-language';
import translate from 'alp-translate/browser';
import Ibex from 'ibex';
import Logger from 'nightingale-logger';

const logger = new Logger('alp');
const configPath = '/config';
class AlpBrowser extends Ibex {
  constructor(path = '/', {
    version = window.__VERSION__
  } = {}) {
    super();
    this.path = path;
    this.appVersion = version;
  }

  async init() {
    const configInstance = await config(this, !(process.env.NODE_ENV !== "production") ? `/${this.appVersion}${configPath}` : configPath);
    this.context.config = configInstance;
    language(this);
    await translate('/locales')(this);
    return this;
  }

  async existsConfig(name) {
    return existsConfig(`${configPath}${name}`);
  }

  loadConfig(name) {
    return getConfig(`${configPath}${name}`);
  }

  start(fn) {
    try {
      fn().then(() => {
        logger.success('started');
      }).catch(err => {
        logger.error('start fail', {
          err
        });
      });
    } catch (err) {
      logger.error('start fail', {
        err
      });
    }
  }

}
const startApp = callback => {
  const app = new AlpBrowser();
  app.start(async () => {
    // init
    const browserApp = await app.init();
    await callback(browserApp);
  });
};

export { AlpBrowser as default, startApp };
//# sourceMappingURL=index-browsermodern.es.js.map
