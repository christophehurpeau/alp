import IntlMessageFormat from 'intl-messageformat';

import t from 'flow-runtime';
export default function load(translations, language) {
  let _translationsType = t.ref('Map');

  let _languageType = t.string();

  t.param('translations', _translationsType).assert(translations);
  t.param('language', _languageType).assert(language);

  const result = new Map();

  (function loadMap(map, prefix) {
    map.forEach((value, key) => {
      if (typeof value === 'object') {
        return loadMap(value, `${prefix}${key}.`);
      }

      result.set(`${prefix}${key}`, new IntlMessageFormat(value, language));
    });
  })(translations, '');

  return result;
}
//# sourceMappingURL=load.js.map