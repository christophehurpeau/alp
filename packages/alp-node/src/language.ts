import type { Context } from 'koa';
import { defineLazyProperty } from 'object-properties';
import type { AlpNodeApp } from './AlpNodeApp';

export interface AlpLanguageContext {
  readonly firstAcceptedLanguage: string;
  readonly language: string;
}
export default function alpLanguage(app: AlpNodeApp): void {
  const config = app.context.config;
  const availableLanguages: string[] = config.get('availableLanguages');
  if (!availableLanguages) {
    throw new Error('Missing config "availableLanguages"');
  }

  defineLazyProperty(app.context, 'language', function (this: Context): string {
    return this.acceptsLanguages(availableLanguages) || availableLanguages[0];
  });

  defineLazyProperty(
    app.context,
    'firstAcceptedLanguage',
    function (this: Context): string {
      return this.acceptsLanguages()[0] || availableLanguages[0];
    },
  );
}
