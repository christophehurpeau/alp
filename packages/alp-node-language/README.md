<h3 align="center">
  alp-node-language
</h3>

<p align="center">
  language context in alp framework
</p>

<p align="center">
  <a href="https://npmjs.org/package/alp-node-language"><img src="https://img.shields.io/npm/v/alp-node-language.svg?style=flat-square"></a>
  <a href="https://david-dm.org/christophehurpeau/alp?path=packages/alp-node-language"><img src="https://david-dm.org/christophehurpeau/alp?path=packages/alp-node-language.svg?style=flat-square"></a>
</p>

## Config file

```yaml
common:
    availableLanguages: [en, fr]
```

## With koa

```js
import App from 'koa';
import config from 'alp-node-config';
import language from 'alp-node-language';

const app = new App();
config('/config')(app);
language(app);
```

## context

### language: string

First accepted language in the header contained in `availableLanguages`, or the first language in `availableLanguages`.

### firstAcceptedLanguage: string

The first accepted language in the header regardless of `availableLanguages`. Can be a locale. Usefull for date/time/...
