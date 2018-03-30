import Ibex from 'ibex';
import config from 'alp-config';
export { Config } from 'alp-config';
import language from 'alp-language';
import translate from 'alp-translate';
import Logger from 'nightingale-logger';

/* global window */

const logger = new Logger('alp');

let AlpBrowser = class extends Ibex {

  constructor(path = '/', { version = window.VERSION } = {}) {
    super();
    this.path = path;
    this.appVersion = window.VERSION;
  }

  async init() {
    await config('/config')(this);
    language(this);
    await translate('/locales')(this);
  }

  get environment() {
    return this.env;
  }

  start(fn) {
    fn().then(function () {
      return logger.success('started');
    }).catch(function (err) {
      return logger.error('start fail', { err });
    });
  }
};

export default AlpBrowser;
//# sourceMappingURL=index-browsermodern.es.js.map
