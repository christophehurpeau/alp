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
