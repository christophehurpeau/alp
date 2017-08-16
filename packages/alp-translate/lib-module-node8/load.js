import IntlMessageFormat from 'intl-messageformat';

export default function load(translations, language) {
  const result = new Map();

  return function loadMap(map, prefix) {
    map.forEach((value, key) => typeof value === 'object' ? loadMap(value, `${prefix}${key}.`) : void result.set(`${prefix}${key}`, new IntlMessageFormat(value, language)));
  }(translations, ''), result;
}
//# sourceMappingURL=load.js.map