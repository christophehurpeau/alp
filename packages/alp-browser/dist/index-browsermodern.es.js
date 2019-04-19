import Ibex from 'ibex';
import config, { existsConfig, getConfig } from 'alp-browser-config';
import language from 'alp-browser-language';
import translate from 'alp-translate/browser';
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
    await config(this, `/${this.appVersion}${configPath}`);
    language(this);
    await translate('/locales')(this);
    return this;
  }

  existsConfig(name) {
    return existsConfig(`${configPath}${name}`);
  }

  loadConfig(name) {
    return getConfig(`${configPath}${name}`);
  }

  start(fn) {
    try {
      fn().then(function () {
        return logger.success('started');
      }).catch(function (err) {
        return logger.error('start fail', {
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

export default AlpBrowser;
//# sourceMappingURL=index-browsermodern.es.js.map
