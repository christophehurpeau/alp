<h3 align="center">
  alp-translate
</h3>

<p align="center">
  Translation in alp framework
</p>

<p align="center">
  <a href="https://npmjs.org/package/alp-translate"><img src="https://img.shields.io/npm/v/alp-translate.svg?style=flat-square"></a>
  <a href="https://david-dm.org/alpjs/alp-translate"><img src="https://david-dm.org/alpjs/alp-translate.svg?style=flat-square"></a>
  <a href="https://dependencyci.com/github/alpjs/alp-translate"><img src="https://dependencyci.com/github/alpjs/alp-translate/badge?style=flat-square"></a>
</p>

## Config

> config/locales/en.yml

```yaml
common:
  'Hello %s!': "Hello %s!"

```

### With Koa

```js
import Koa from 'koa';
import config from 'alp-config';
import translate from 'alp-translate';

const app = new Koa();
config(__dirname + '/config')(app);
translate('locales')(app);
```

```js
    index(ctx) {
        const name = ctx.params.string('name').notEmpty().value;
        ctx.body = ctx.t('Hello %s!', ctx.params.isValid() ? name : 'World');
    },
```

#### .t(key, ...args)
