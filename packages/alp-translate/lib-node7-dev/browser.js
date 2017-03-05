'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = alpTranslate;

var _load = require('./load');

var _load2 = _interopRequireDefault(_load);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function alpTranslate(dirname) {
  let _dirnameType = _flowRuntime2.default.string();

  _flowRuntime2.default.param('dirname', _dirnameType).assert(dirname);

  dirname = _dirnameType.assert(dirname.replace(/\/*$/, '/'));
  return app => {
    Object.assign(app.context, {
      t(key, args) {
        let _keyType = _flowRuntime2.default.string();

        let _argsType = _flowRuntime2.default.nullable(_flowRuntime2.default.object());

        const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.string());

        _flowRuntime2.default.param('key', _keyType).assert(key);

        _flowRuntime2.default.param('args', _argsType).assert(args);

        const msg = app.translations.get(key);
        if (!msg) return _returnType.assert(key);
        return _returnType.assert(msg.format(args));
      }
    });

    const language = app.context.language;
    return app.loadConfig(dirname + language).then(map => app.translations = (0, _load2.default)(map, language));
  };
}
//# sourceMappingURL=browser.js.map