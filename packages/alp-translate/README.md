# alp-translate [![NPM version][npm-image]][npm-url]

Translation in alp framework

[![Dependency ci Status][dependencyci-image]][dependencyci-url]
[![Dependency Status][daviddm-image]][daviddm-url]

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

[npm-image]: https://img.shields.io/npm/v/alp-translate.svg?style=flat-square
[npm-url]: https://npmjs.org/package/alp-translate
[daviddm-image]: https://david-dm.org/alpjs/alp-translate.svg?style=flat-square
[daviddm-url]: https://david-dm.org/alpjs/alp-translate
[dependencyci-image]: https://dependencyci.com/github/alpjs/alp-translate/badge?style=flat-square
[dependencyci-url]: https://dependencyci.com/github/alpjs/alp-translate
