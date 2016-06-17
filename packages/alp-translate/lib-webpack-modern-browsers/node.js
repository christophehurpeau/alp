import load from './load';

export default function alpTranslate(dirname) {
    dirname = dirname.replace(/\/*$/, '/');
    return app => {
        Object.assign(app.context, {
            t(key, args) {
                var msg = app.translations.get(this.language).get(key);
                if (!msg) return key;
                return msg.format(args);
            }
        });

        app.translations = new Map();
        app.config.get('availableLanguages').forEach(language => {
            var translations = app.loadConfigSync(dirname + language);
            app.translations.set(language, load(translations, language));
        });
    };
}
//# sourceMappingURL=node.js.map