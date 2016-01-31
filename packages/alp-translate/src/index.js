/**
 * Format a string using {\d} (like {0} or {1})
 *
 * @param {string} string
 * @param {string[]} args
 * @return {string}
 */
function vformat(string, args) {
    return string.replace(/{(\d+)}/g, (match, number) => args[parseInt(number, 10)] || '');
}

export default function aukTranslate(dirname) {
    dirname = dirname.replace(/\/*$/, '/');
    return app => {
        Object.assign(app.context, {
            t(string, ...args) {
                string = app.translations.get(this.language).get(string) || string;
                return args ? vformat(string, args) : string;
            },
        });

        app.translations = new Map();
        app.config.get('availableLanguages').forEach(language => {
            app.translations.set(language, app.loadConfig(dirname + language));
        });
    };
}
