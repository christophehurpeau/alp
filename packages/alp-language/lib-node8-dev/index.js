'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = alpLanguage;

var _objectProperties = require('object-properties');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function alpLanguage(app) {
  const config = app.context.config;
  const availableLanguages = _flowRuntime2.default.array(_flowRuntime2.default.string()).assert(config.get('availableLanguages'));
  if (!availableLanguages) throw new Error('Missing config "availableLanguages"');

  (0, _objectProperties.defineLazyProperty)(app.context, 'language', function () {
    return this.acceptsLanguages(availableLanguages);
  }), (0, _objectProperties.defineLazyProperty)(app.context, 'firstAcceptedLanguage', function () {
    return this.acceptsLanguages()[0] || availableLanguages[0];
  });
}
//# sourceMappingURL=index.js.map