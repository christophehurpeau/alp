import load from './load';

export default function alpTranslate(dirname) {
  return dirname = dirname.replace(/\/*$/, '/'), function (app) {
    Object.assign(app.context, {
      t: function t(key, args) {
        var msg = app.translations.get(key);
        return msg ? msg.format(args) : key;
      }
    });


    var language = app.context.language;
    return app.loadConfig(dirname + language).then(function (map) {
      return app.translations = load(map, language);
    });
  };
}
//# sourceMappingURL=browser.js.map