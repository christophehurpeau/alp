'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = ibexTranslate;
/**
 * Format a string using {\d}
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
*/function ibexTranslate(dirname) {
    dirname = dirname.replace(/\/*$/, '/');
    return function (app) {
        Object.assign(app.context, {
            t: /**
                * @function
                * @param string
                * @param {...*} args
               */function t(string) {
                string = app.translations.get(string) || string;

                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key];
                }

                return args ? vformat(string, args) : string;
            }
        });

        var language = app.context.language;
        return app.loadConfig(dirname + language).then(function (map) {
            return app.translations = map;
        });
    };
}
//# sourceMappingURL=browser.js.map