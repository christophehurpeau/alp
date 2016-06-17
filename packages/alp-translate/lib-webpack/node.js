import load from './load';

export default function alpTranslate(dirname) {
    dirname = dirname.replace(/\/*$/, '/');
    return function (app) {
        Object.assign(app.context, {
            t: function t(key, args) {
                var msg = app.translations.get(this.language).get(key);
                if (!msg) return key;
                return msg.format(args);
            }
        });

        app.translations = new Map();
        app.config.get('availableLanguages').forEach(function (language) {
            var translations = app.loadConfigSync(dirname + language);
            app.translations.set(language, load(translations, language));
        });
    };
}
//# sourceMappingURL=node.js.map