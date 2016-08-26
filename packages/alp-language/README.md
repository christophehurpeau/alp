# alp-language

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
