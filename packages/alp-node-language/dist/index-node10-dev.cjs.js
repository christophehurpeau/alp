'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var objectProperties = require('object-properties');

function alpLanguage(app) {
  const config = app.context.config;
  const availableLanguages = config.get('availableLanguages');

  if (!availableLanguages) {
    throw new Error('Missing config "availableLanguages"');
  }

  objectProperties.defineLazyProperty(app.context, 'language', function () {
    return this.acceptsLanguages(availableLanguages);
  });
  objectProperties.defineLazyProperty(app.context, 'firstAcceptedLanguage', function () {
    return this.acceptsLanguages()[0] || availableLanguages[0];
  });
}

exports.default = alpLanguage;
//# sourceMappingURL=index-node10-dev.cjs.js.map