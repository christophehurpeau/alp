import load from './load';

export default function alpTranslate(dirname) {
  return dirname = dirname.replace(/\/*$/, '/'), app => {
    Object.assign(app.context, {
      t(key, args) {
        const msg = app.translations.get(key);
        return msg ? msg.format(args) : key;
      }
    });


    const language = app.context.language;
    return app.loadConfig(dirname + language).then(map => app.translations = load(map, language));
  };
}
//# sourceMappingURL=browser.js.map