import IntlMessageFormat from 'intl-messageformat';

import t from 'flow-runtime';
export default function load(translations, language) {
  let _translationsType = t.ref('Map', t.string(), t.any());

  let _languageType = t.string();

  t.param('translations', _translationsType).assert(translations), t.param('language', _languageType).assert(language);

  const result = new Map();

  return function loadMap(map, prefix) {
    map.forEach(function (value, key) {
      return typeof value === 'object' ? loadMap(value, `${prefix}${key}.`) : void result.set(`${prefix}${key}`, new IntlMessageFormat(value, language));
    });
  }(translations, ''), result;
}
//# sourceMappingURL=load.js.map