/* global navigator */
export default function alpLanguage(app) {
  const config = app.context.config;
  const availableLanguages = config.get('availableLanguages');
  if (!availableLanguages) {
    throw new Error('Missing config "availableLanguages"');
  }

  app.context.firstAcceptedLanguage = navigator.languages[0] || availableLanguages[0];

  const languageFound = navigator.languages.some(language => {
    const languageCode = language.split('-')[0].toLowerCase();
    if (availableLanguages.indexOf(languageCode) !== -1) {
      app.context.language = languageCode;
      return true;
    }

    return false;
  });

  if (!languageFound) {
    app.context.language = availableLanguages[0];
  }
}
//# sourceMappingURL=browser.js.map