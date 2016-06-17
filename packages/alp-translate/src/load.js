import IntlMessageFormat from 'intl-messageformat';

export default function load(translations: Map, language: string) {
    translations.forEach((value, key) => {
        translations.set(key, new IntlMessageFormat(value, language));
    });

    return translations;
}
