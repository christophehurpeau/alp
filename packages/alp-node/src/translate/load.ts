import IntlMessageFormatDefault from 'intl-messageformat';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const IntlMessageFormat: typeof IntlMessageFormatDefault =
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  (IntlMessageFormatDefault as any).default || IntlMessageFormatDefault;

export type Translations = ReadonlyMap<string, IntlMessageFormatDefault>;

export default function load(
  translations: ReadonlyMap<string, unknown>,
  language: string,
): Translations {
  const result = new Map();

  (function loadMap(map, prefix) {
    map.forEach((value: any, key) => {
      if (typeof value === 'object') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        loadMap(value, `${prefix}${key}.`);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      result.set(`${prefix}${key}`, new IntlMessageFormat(value, language));
    });
  })(translations, '');

  return result;
}
