import { defineLazyProperty } from 'object-properties';
import { ApplicationInCreation, Context } from 'alp-types';

export default function alpLanguage(app: ApplicationInCreation) {
  const config = app.context.config;
  const availableLanguages: string[] = config.get('availableLanguages');
  if (!availableLanguages) {
    throw new Error('Missing config "availableLanguages"');
  }

  defineLazyProperty(app.context, 'language', function(this: Context) {
    return this.acceptsLanguages(availableLanguages);
  });

  defineLazyProperty(app.context, 'firstAcceptedLanguage', function(
    this: Context,
  ) {
    return this.acceptsLanguages()[0] || availableLanguages[0];
  });
}
