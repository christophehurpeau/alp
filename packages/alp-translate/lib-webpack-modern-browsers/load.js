import IntlMessageFormat from 'intl-messageformat';

export default function load(translations, language) {
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
//# sourceMappingURL=load.js.map