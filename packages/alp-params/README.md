# alp-params-node

```js
import Koa from 'koa';
import params from 'alp-params-node';

const app = new Koa();
params(app);
```

```js
    index(ctx) {
        const name = ctx.params.string('name').notEmpty().value;
        ctx.body = this.t('Hello %s!', ctx.params.isValid() ? name : 'World');
    },

    something(ctx) {
        // throw a 404 if the param was not found
        const name = ctx.validParams.string('name').notEmpty().value;
        ctx.body = this.t('Hello %s!', name);
    },
```

## Validator

#### .isValid()
#### .hasErrors()
#### .getErrors()
#### .string(name, position)

## ValueStringValidator

#### .notEmpty()
