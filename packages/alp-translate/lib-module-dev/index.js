import Logger from 'nightingale-logger';
import load from './load';

import _t from 'flow-runtime';
var logger = new Logger('alp:translate');

export default function alpTranslate(dirname) {
  var _dirnameType = _t.string();

  _t.param('dirname', _dirnameType).assert(dirname);

  dirname = _dirnameType.assert(dirname.replace(/\/*$/, '/'));
  return function (app) {
    Object.assign(app.context, {
      t: function t(key, args) {
        var _keyType = _t.string();

        var _argsType = _t.nullable(_t.object());

        var _returnType = _t.return(_t.string());

        _t.param('key', _keyType).assert(key);

        _t.param('args', _argsType).assert(args);

        var msg = app.translations.get(this.language).get(key);
        if (!msg) {
          logger.warn('invalid msg', { language: this.language, key: key });
          return _returnType.assert(key);
        }

        return _returnType.assert(msg.format(args));
      }
    });

    app.translations = new Map();
    app.config.get('availableLanguages').forEach(function (language) {
      var translations = app.config.loadConfigSync(dirname + language);
      app.translations.set(language, load(translations, language));
    });
  };
}
//# sourceMappingURL=index.js.map