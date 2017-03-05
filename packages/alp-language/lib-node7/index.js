'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = alpLanguage;

var _objectProperties = require('object-properties');

function alpLanguage(app) {
  const config = app.context.config;
  const availableLanguages = config.get('availableLanguages');
  if (!availableLanguages) {
    throw new Error('Missing config "availableLanguages"');
  }

  (0, _objectProperties.defineLazyProperty)(app.context, 'language', function () {
    return this.acceptsLanguages(availableLanguages);
  });

  (0, _objectProperties.defineLazyProperty)(app.context, 'firstAcceptedLanguage', function () {
    return this.acceptsLanguages()[0] || availableLanguages[0];
  });
}
//# sourceMappingURL=index.js.map