<h3 align="center">
  alp-language
</h3>

<p align="center">
  language context in alp framework
</p>

<p align="center">
  <a href="https://npmjs.org/package/alp-language"><img src="https://img.shields.io/npm/v/alp-language.svg?style=flat-square"></a>
  <a href="https://david-dm.org/alpjs/alp-language"><img src="https://david-dm.org/alpjs/alp-language.svg?style=flat-square"></a>
  <a href="https://dependencyci.com/github/alpjs/alp-language"><img src="https://dependencyci.com/github/alpjs/alp-language/badge?style=flat-square"></a>
</p>

## Config file

```yaml
common:
    availableLanguages: [en, fr]
```

## With Koa

```js
import Koa from 'koa';
import config from 'alp-config';
import language from 'alp-language';

const app = new Koa();
config(__dirname + '/config')(app);
language(app);
```

## With Ibex (Browser)

```js
import Ibex from 'ibex';
import config from 'alp-config';
import language from 'alp-language';

const app = new Ibex();
config('/config')(app);
language(app);
```

## context

### language: string

First accepted language in the header / in `navigator.languages` contained in `availableLanguages`, or the first language in `availableLanguages`.

### firstAcceptedLanguage: string

The first accepted language in the header / in `navigator.languages` regardless of `availableLanguages`. Can be a locale. Usefull for date/time/...
