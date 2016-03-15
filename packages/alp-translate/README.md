# alp-translate

`config/locales/en.yml`

```yaml
common:
    'Hello %s!': "Hello %s!"
```

### With Koa

```js
import Koa from 'koa';
import config from 'alp-config';
import translate from 'alp-translate';

const app = new Auk();
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
