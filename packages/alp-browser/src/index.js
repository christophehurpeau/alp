import Ibex from 'ibex/src';
import config from 'alp-config/src';
import language from 'alp-language/src';
import translate from 'alp-translate/src';
import Logger from 'nightingale-logger/src';

export { Config } from 'alp-config/src';

const logger = new Logger('alp');

type OptionsType = {
  version?: ?string, // default to window.VERSION
};

export default class AlpBrowser extends Ibex {
  path: string;
  appVersion: string;

  constructor(path = '/', { version = window.VERSION }: OptionsType = {}) {
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

  start(fn: Function) {
    fn()
      .then(() => logger.success('started'))
      .catch(err => logger.error('start fail', { err }));
  }
}
