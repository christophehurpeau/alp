'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var objectProperties = require('object-properties');
var t = _interopDefault(require('flow-runtime'));

function alpLanguage(app) {
  const config = app.context.config;
  const availableLanguages = t.array(t.string()).assert(config.get('availableLanguages'));
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

module.exports = alpLanguage;
//# sourceMappingURL=index-node8-dev.cjs.js.map
