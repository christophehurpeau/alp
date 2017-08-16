# alp-language [![NPM version][npm-image]][npm-url]

language context in alp framework

[![Dependency Status][daviddm-image]][daviddm-url]
[![Dependency ci Status][dependencyci-image]][dependencyci-url]

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

[npm-image]: https://img.shields.io/npm/v/alp-language.svg?style=flat-square
[npm-url]: https://npmjs.org/package/alp-language
[daviddm-image]: https://david-dm.org/alpjs/alp-language.svg?style=flat-square
[daviddm-url]: https://david-dm.org/alpjs/alp-language
[dependencyci-image]: https://dependencyci.com/github/alpjs/alp-language/badge?style=flat-square
[dependencyci-url]: https://dependencyci.com/github/alpjs/alp-language
