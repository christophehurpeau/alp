import _t from 'tcomb-forked';
import IntlMessageFormat from 'intl-messageformat';

export default function load(translations, language) {
  _assert(translations, Map, 'translations');

  _assert(language, _t.String, 'language');

  var result = new Map();

  (function loadMap(map, prefix) {
    map.forEach(function (value, key) {
      if (typeof value === 'object') {
        return loadMap(value, `${ prefix }${ key }.`);
      }

      result.set(`${ prefix }${ key }`, new IntlMessageFormat(value, language));
    });
  })(translations, '');

  return result;
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
//# sourceMappingURL=load.js.map