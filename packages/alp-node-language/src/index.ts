import type { ApplicationInCreation } from 'alp-types';
// eslint-disable-next-line node/no-extraneous-import
import type { Context } from 'koa';
import { defineLazyProperty } from 'object-properties';

declare module 'alp-types' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface BaseContext {}
  // eslint-disable-next-line @typescript-eslint/no-shadow
  interface Context {
    readonly firstAcceptedLanguage: string;
    readonly language: string;
  }
}

export default function alpLanguage(app: ApplicationInCreation): void {
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
