import IntlMessageFormat from 'intl-messageformat';

export default function load(translations: Map, language: string) {
    const result = new Map();

    (function loadMap(map, prefix) {
        map.forEach((value, key) => {
            if (typeof value === 'object') {
                return loadMap(value, `${key}.`);
            }

            result.set(`${prefix}${key}`, new IntlMessageFormat(value, language));
        });
    }(translations, ''));

    return result;
}
