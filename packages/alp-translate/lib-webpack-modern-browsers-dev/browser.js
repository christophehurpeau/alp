import _t from 'tcomb-forked';
import load from './load';

export default function alpTranslate(dirname) {
  dirname = dirname.replace(/\/*$/, '/');
  return function (app) {
    Object.assign(app.context, {
      t(key, args) {
        _assert(key, _t.String, 'key');

        _assert(args, _t.maybe(_t.Object), 'args');

        return _assert(function () {
          var msg = app.translations.get(key);
          if (!msg) return key;
          return msg.format(args);
        }.apply(this, arguments), _t.String, 'return value');
      }
    });

    var language = app.context.language;
    return app.loadConfig(dirname + language).then(function (map) {
      return app.translations = load(map, language);
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
//# sourceMappingURL=browser.js.map