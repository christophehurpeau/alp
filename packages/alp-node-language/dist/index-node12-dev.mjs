import { defineLazyProperty } from 'object-properties';

// eslint-disable-next-line node/no-extraneous-import
function alpLanguage(app) {
  const config = app.context.config;
  const availableLanguages = config.get('availableLanguages');

  if (!availableLanguages) {
    throw new Error('Missing config "availableLanguages"');
  }

  defineLazyProperty(app.context, 'language', function () {
    return this.acceptsLanguages(availableLanguages) || availableLanguages[0];
  });
  defineLazyProperty(app.context, 'firstAcceptedLanguage', function () {
    return this.acceptsLanguages()[0] || availableLanguages[0];
  });
}

export default alpLanguage;
//# sourceMappingURL=index-node12-dev.mjs.map
