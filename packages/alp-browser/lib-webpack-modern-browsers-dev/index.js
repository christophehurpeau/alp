import _t from 'tcomb-forked';

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

var logger = new Logger('alp');

var OptionsType = _t.interface({
  version: _t.maybe(_t.String)
}, 'OptionsType');

export default class AlpBrowser extends Ibex {

  constructor() {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';

    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$version = _ref.version,
        version = _ref$version === undefined ? window.VERSION : _ref$version;

    _assert({
      version
    }, OptionsType, '{ version = window.VERSION }');

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
    var context = Object.create(this.context);
    Object.assign(context, global.initialBrowserContext);
    delete context.state;

    return contentLoaded().then(() => context.render(moduleDescriptor, data, true)).then(() => {
      this.on('redirect', redirect);
      initWebApp(url => this.load(url));
    });
  }

  start(fn) {
    _assert(fn, _t.Function, 'fn');

    fn().then(() => logger.success('started')).catch(err => logger.error('start fail', { err }));
  }
}

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _t.stringify(x) + ' supplied to ' + name + ' (expected a ' + _t.getTypeName(type) + ')';
  }

  if (_t.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _t.getTypeName(type)]);

      _t.fail(message());
    }
  } else if (!(x instanceof type)) {
    _t.fail(message());
  }

  return x;
}
//# sourceMappingURL=index.js.map