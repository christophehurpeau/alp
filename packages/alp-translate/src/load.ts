import IntlMessageFormat from 'intl-messageformat';

export type Translations = ReadonlyMap<string, IntlMessageFormat>;

export default function load(
  translations: ReadonlyMap<string, unknown>,
  language: string,
): Translations {
  const result = new Map();

  (function loadMap(map, prefix) {
    map.forEach((value: any, key) => {
      if (typeof value === 'object') {
        return loadMap(value, `${prefix}${key}.`);
      }

      result.set(`${prefix}${key}`, new IntlMessageFormat(value, language));
    });
  })(translations, '');

  return result;
}
