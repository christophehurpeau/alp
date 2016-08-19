# alp-params [![NPM version][npm-image]][npm-url]

Validate params from query, router or post body in koa 2 or ibex

[![Build Status][circleci-status-image]][circleci-status-url][![Travis Status][travisci-status-image]][travisci-status-url][![Dependency Status][daviddm-image]][daviddm-url]
 [![Coverage percentage][coverage-image]][coverage-url]

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

[npm-image]: https://img.shields.io/npm/v/alp-params.svg?style=flat-square
[npm-url]: https://npmjs.org/package/alp-params
[daviddm-image]: https://david-dm.org//alp-params.svg?style=flat-square
[daviddm-url]: https://david-dm.org//alp-params
[circleci-status-image]: https://img.shields.io/circleci/project//alp-params/master.svg?style=flat-square
[circleci-status-url]: https://circleci.com/gh//alp-params
[travisci-status-image]: https://img.shields.io/travisci/project//alp-params/master.svg?style=flat-square
[travisci-status-url]: https://travis-ci.org//alp-params
[coverage-image]: https://img.shields.io/coveralls//alp-params/master.svg?style=flat-square
[coverage-url]: https://.github.io/alp-params/coverage/lcov-report/
