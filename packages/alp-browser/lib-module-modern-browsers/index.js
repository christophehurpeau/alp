/* global window */
import Ibex from 'ibex';
import config from 'alp-config';
import language from 'alp-language';
import translate from 'alp-translate';
import Logger from 'nightingale-logger';

export { Config } from 'alp-config';

const logger = new Logger('alp');

let AlpBrowser = class extends Ibex {

  constructor(path = '/', { version = window.VERSION } = {}) {
    super(), this.path = path, this.appVersion = window.VERSION;
  }

  async init() {
    await config('/config')(this), language(this), await translate('/locales')(this);
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
export { AlpBrowser as default };
//# sourceMappingURL=index.js.map