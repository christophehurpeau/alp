import Ibex from 'ibex';
import config from 'alp-config';
import language from 'alp-language';
import translate from 'alp-translate';
import Logger from 'nightingale-logger';
import t from 'flow-runtime';

const logger = new Logger('alp');

const OptionsType = t.type('OptionsType', t.object(t.property('version', t.nullable(t.string()), true)));
let AlpBrowser = class extends Ibex {

  constructor(path = '/', _arg = {}) {
    let { version = window.VERSION } = OptionsType.assert(_arg);

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
    let _fnType = t.function();

    t.param('fn', _fnType).assert(fn);

    fn().then(function () {
      return logger.success('started');
    }).catch(function (err) {
      return logger.error('start fail', { err });
    });
  }
};

export default AlpBrowser;
//# sourceMappingURL=index-browsermodern-dev.es.js.map
