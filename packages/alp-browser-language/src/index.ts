import type { BrowserApplicationInCreation } from 'alp-types';

declare module 'alp-types' {
  interface BaseContext {
    firstAcceptedLanguage: string;
    language: string;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Context {}
}

export default function alpLanguage(app: BrowserApplicationInCreation): void {
  const config = app.context.config;
  const availableLanguages = config.get<string[] | undefined>(
    'availableLanguages',
  );
  if (!availableLanguages) {
    throw new Error('Missing config "availableLanguages"');
  }

  app.context.firstAcceptedLanguage =
    navigator.languages[0] || availableLanguages[0];

  const languageFound = navigator.languages.some((language) => {
    const languageCode = language.split('-')[0].toLowerCase();
    if (availableLanguages.includes(languageCode)) {
      app.context.language = languageCode;
      return true;
    }

    return false;
  });

  if (!languageFound) {
    app.context.language = availableLanguages[0];
  }
}
