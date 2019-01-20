<h3 align="center">
  alp-browser-language
</h3>

<p align="center">
  language context in alp framework
</p>

<p align="center">
  <a href="https://npmjs.org/package/alp-browser-language"><img src="https://img.shields.io/npm/v/alp-browser-language.svg?style=flat-square"></a>
  <a href="https://david-dm.org/christophehurpeau/alp?path=packages/alp-browser-language"><img src="https://david-dm.org/christophehurpeau/alp?path=packages/alp-browser-language.svg?style=flat-square"></a>
</p>

## Config file

```yaml
common:
    availableLanguages: [en, fr]
```

## With Ibex

```js
import Ibex from 'ibex';
import config from 'alp-browser-config';
import language from 'alp-browser-language';

const app = new Ibex();
config('/config')(app);
language(app);
```

## context

### language: string

First accepted language in the header / in `navigator.languages` contained in `availableLanguages`, or the first language in `availableLanguages`.

### firstAcceptedLanguage: string

The first accepted language in the header / in `navigator.languages` regardless of `availableLanguages`. Can be a locale. Usefull for date/time/...
