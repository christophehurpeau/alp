'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = aukTranslate;
/**
 * Format a string using %s
 *
 * @param {string} string
 * @param {...string} args
 * @return {string}
 */
function format(string) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    return vformat(string, args);
}

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

function aukTranslate(dirname) {
    dirname = dirname.replace(/\/*$/, '/');
    return app => {
        Object.assign(app.context, {
            t: function t(string) {
                string = app.translations.get(this.language).get(string) || string;

                for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                    args[_key2 - 1] = arguments[_key2];
                }

                return args ? vformat(string, args) : string;
            }
        });

        app.translations = new Map();
        app.config.get('availableLanguages').forEach(language => {
            app.translations.set(language, app.loadConfig(dirname + language));
        });
    };
}
//# sourceMappingURL=index.js.map