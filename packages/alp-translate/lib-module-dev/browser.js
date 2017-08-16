import load from './load';

import _t from 'flow-runtime';
export default function alpTranslate(dirname) {
  var _dirnameType = _t.string();

  return _t.param('dirname', _dirnameType).assert(dirname), dirname = _dirnameType.assert(dirname.replace(/\/*$/, '/')), function (app) {
    Object.assign(app.context, {
      t: function t(key, args) {
        var _keyType = _t.string();

        var _argsType = _t.nullable(_t.object());

        var _returnType = _t.return(_t.string());

        _t.param('key', _keyType).assert(key), _t.param('args', _argsType).assert(args);

        var msg = app.translations.get(key);
        return msg ? _returnType.assert(msg.format(args)) : _returnType.assert(key);
      }
    });


    var language = app.context.language;
    return app.loadConfig(dirname + language).then(function (map) {
      return app.translations = load(map, language);
    });
  };
}
//# sourceMappingURL=browser.js.map