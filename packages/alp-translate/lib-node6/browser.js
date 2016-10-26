'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = alpTranslate;

var _load = require('./load');

var _load2 = _interopRequireDefault(_load);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function alpTranslate(dirname) {
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
    return app.loadConfig(dirname + language).then(map => app.translations = (0, _load2.default)(map, language));
  };
}
//# sourceMappingURL=browser.js.map