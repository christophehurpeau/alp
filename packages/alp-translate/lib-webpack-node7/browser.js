import load from './load';

export default function alpTranslate(dirname) {
  dirname = dirname.replace(/\/*$/, '/');
  return app => {
    Object.assign(app.context, {
      t(key, args) {
        const msg = app.translations.get(key);
        if (!msg) return key;
        return msg.format(args);
      }
    });

    const language = app.context.language;
    return app.loadConfig(dirname + language).then(map => app.translations = load(map, language));
  };
}
//# sourceMappingURL=browser.js.map