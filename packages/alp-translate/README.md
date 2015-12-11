# auk-translate

`config/locales/en.yml`

```yaml
common:
    'Hello %s!': "Hello %s!"
```

`index.server.js`

```js
import Koa from 'koa';
import config from 'auk-config';
import translate from 'auk-translate';

const app = new Auk();
config(__dirname + '/config')(app);
translate('locales')(app);
```

```js
    index(ctx) {
        const name = ctx.params.string('name').notEmpty().value;
        ctx.body = this.t('Hello %s!', ctx.params.isValid() ? name : 'World');
    },
```

#### .t(key, ...args)
