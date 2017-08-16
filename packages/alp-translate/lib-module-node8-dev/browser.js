import load from './load';

import _t from 'flow-runtime';
export default function alpTranslate(dirname) {
  let _dirnameType = _t.string();

  return _t.param('dirname', _dirnameType).assert(dirname), dirname = _dirnameType.assert(dirname.replace(/\/*$/, '/')), app => {
    Object.assign(app.context, {
      t(key, args) {
        let _keyType = _t.string();

        let _argsType = _t.nullable(_t.object());

        const _returnType = _t.return(_t.string());

        _t.param('key', _keyType).assert(key), _t.param('args', _argsType).assert(args);

        const msg = app.translations.get(key);
        return msg ? _returnType.assert(msg.format(args)) : _returnType.assert(key);
      }
    });


    const language = app.context.language;
    return app.loadConfig(dirname + language).then(map => app.translations = load(map, language));
  };
}
//# sourceMappingURL=browser.js.map