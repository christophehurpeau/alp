import _t from 'tcomb-forked';
import Logger from 'nightingale-logger';
import load from './load';

var logger = new Logger('alp:translate');

export default function alpTranslate(dirname) {
  dirname = dirname.replace(/\/*$/, '/');
  return app => {
    Object.assign(app.context, {
      t(key, args) {
        _assert(key, _t.String, 'key');

        _assert(args, _t.maybe(_t.Object), 'args');

        return _assert(function () {
          var msg = app.translations.get(this.language).get(key);
          if (!msg) {
            logger.warn('invalid msg', { language: this.language, key });
            return key;
          }

          return msg.format(args);
        }.apply(this, arguments), _t.String, 'return value');
      }
    });

    app.translations = new Map();
    app.config.get('availableLanguages').forEach(language => {
      var translations = app.config.loadConfigSync(dirname + language);
      app.translations.set(language, load(translations, language));
    });
  };
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