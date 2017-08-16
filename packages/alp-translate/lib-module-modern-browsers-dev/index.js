import Logger from 'nightingale-logger';
import load from './load';

import _t from 'flow-runtime';
const logger = new Logger('alp:translate');

export default function alpTranslate(dirname) {
  let _dirnameType = _t.string();

  return _t.param('dirname', _dirnameType).assert(dirname), dirname = _dirnameType.assert(dirname.replace(/\/*$/, '/')), function (app) {
    Object.assign(app.context, {
      t(key, args) {
        let _keyType = _t.string();

        let _argsType = _t.nullable(_t.object());

        const _returnType = _t.return(_t.string());

        _t.param('key', _keyType).assert(key), _t.param('args', _argsType).assert(args);

        const msg = app.translations.get(this.language).get(key);
        return msg ? _returnType.assert(msg.format(args)) : (logger.warn('invalid msg', { language: this.language, key }), _returnType.assert(key));
      }
    }), app.translations = new Map(), app.config.get('availableLanguages').forEach(function (language) {
      const translations = app.config.loadConfigSync(dirname + language);
      app.translations.set(language, load(translations, language));
    });
  };
}
//# sourceMappingURL=index.js.map