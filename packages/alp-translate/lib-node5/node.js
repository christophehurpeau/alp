'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = alpTranslate;

var _load = require('./load');

var _load2 = _interopRequireDefault(_load);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function alpTranslate(dirname) {
    dirname = dirname.replace(/\/*$/, '/');
    return app => {
        Object.assign(app.context, {
            t: function t(key, args) {
                const msg = app.translations.get(this.language).get(key);
                if (!msg) return key;
                return msg.format(args);
            }
        });

        app.translations = new Map();
        app.config.get('availableLanguages').forEach(language => {
            const translations = app.loadConfigSync(dirname + language);
            app.translations.set(language, (0, _load2.default)(translations, language));
        });
    };
}
//# sourceMappingURL=node.js.map