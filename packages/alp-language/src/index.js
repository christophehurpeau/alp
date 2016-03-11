import { defineLazyProperty } from 'object-properties';

export default function alpLanguage(app) {
    const config = app.context.config;
    const availableLanguages = config.get('availableLanguages');
    if (!availableLanguages) {
        throw new Error('Missing config "availableLanguages"');
    }

    defineLazyProperty(app.context, 'language', function () {
        return this.acceptsLanguages(availableLanguages);
    });
}
