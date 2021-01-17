<h3 align="center">
  alp-params
</h3>

<p align="center">
  Validate params from query, router or post body in koa 2 or ibex
</p>

<p align="center">
  <a href="https://npmjs.org/package/alp-params"><img src="https://img.shields.io/npm/v/alp-params.svg?style=flat-square"></a>
</p>

## Install

```sh
npm install --save alp-params
```

## API

[https://.github.io/alp-params/docs](http://.github.io/alp-params/docs)

### Validator

##### .isValid()

##### .hasErrors()

##### .getErrors()

##### .string(name, position)

### ValueStringValidator

##### .notEmpty()

## Usage

```js
import Koa from 'koa';
import params from 'alp-params';

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
