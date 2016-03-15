/**
 * Format a string using {\d}
 *
 * @param {string} string
 * @param {string[]} args
 * @return {string}
 */
function vformat(string, args) {
    return string.replace(/{(\d+)}/g, (match, number) => args[parseInt(number, 10)] || '');
}

export default function ibexTranslate(dirname) {
    dirname = dirname.replace(/\/*$/, '/');
    return app => {
        Object.assign(app.context, {
            t(string, ...args) {
                string = app.translations.get(string) || string;
                return args ? vformat(string, args) : string;
            },
        });

        const language = app.context.language;
        return app.loadConfig(dirname + language)
            .then(map => app.translations = map);
    };
}
