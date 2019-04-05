import { BrowserApplicationInCreation } from 'alp-types';

export default function alpLanguage(app: BrowserApplicationInCreation) {
  const config = app.context.config;
  const availableLanguages = config.get('availableLanguages');
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
