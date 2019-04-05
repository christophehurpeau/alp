'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function alpLanguage(app) {
  var config = app.context.config;
  var availableLanguages = config.get('availableLanguages');

  if (!availableLanguages) {
    throw new Error('Missing config "availableLanguages"');
  }

  app.context.firstAcceptedLanguage = navigator.languages[0] || availableLanguages[0];
  var languageFound = navigator.languages.some(function (language) {
    var languageCode = language.split('-')[0].toLowerCase();

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

exports.default = alpLanguage;
//# sourceMappingURL=index-browser.cjs.js.map
