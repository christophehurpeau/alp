'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = aukTranslate;
/**
 * Format a string using {\d} (like {0} or {1})
 *
 * @param {string} string
 * @param {string[]} args
 * @return {string}
 * @function
*/
function vformat(string, args) {
    return string.replace(/{(\d+)}/g, function (match, number) {
        return args[parseInt(number, 10)] || '';
    });
}

/**
 * @function
 * @param dirname
*/function aukTranslate(dirname) {
    dirname = dirname.replace(/\/*$/, '/');
    return function (app) {
        Object.assign(app.context, {
            t: /**
                * @function
                * @param string
                * @param {...*} args
               */function t(string) {
                string = app.translations.get(this.language).get(string) || string;

                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key];
                }

                return args ? vformat(string, args) : string;
            }
        });

        app.translations = new Map();
        app.config.get('availableLanguages').forEach(function (language) {
            app.translations.set(language, app.loadConfig(dirname + language));
        });
    };
}
//# sourceMappingURL=node.js.map