'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = alpTranslate;

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _load = require('./load');

var _load2 = _interopRequireDefault(_load);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('alp.translate');

function alpTranslate(dirname) {
  dirname = dirname.replace(/\/*$/, '/');
  return app => {
    Object.assign(app.context, {
      t(key, args) {
        _assert(key, _tcombForked2.default.String, 'key');

        _assert(args, _tcombForked2.default.maybe(_tcombForked2.default.Object), 'args');

        return _assert(function () {
          const msg = app.translations.get(this.language).get(key);
          if (!msg) {
            logger.warn('invalid msg', { language: this.language, key });
            return key;
          }

          return msg.format(args);
        }.apply(this, arguments), _tcombForked2.default.String, 'return value');
      }
    });

    app.translations = new Map();
    app.config.get('availableLanguages').forEach(language => {
      const translations = app.config.loadConfigSync(dirname + language);
      app.translations.set(language, (0, _load2.default)(translations, language));
    });
  };
}

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')';
  }

  if (_tcombForked2.default.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);

      _tcombForked2.default.fail(message());
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=node.js.map