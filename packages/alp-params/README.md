# alp-params [![NPM version][npm-image]][npm-url]

Validate params from query, router or post body in koa 2 or ibex

[![Build Status][circleci-status-image]][circleci-status-url]
[![Travis Status][travisci-status-image]][travisci-status-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![Dependency ci Status][dependencyci-image]][dependencyci-url]
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
[daviddm-image]: https://david-dm.org/alpjs/alp-params.svg?style=flat-square
[daviddm-url]: https://david-dm.org/alpjs/alp-params
[dependencyci-image]: https://dependencyci.com/github/alpjs/alp-params/badge?style=flat-square
[dependencyci-url]: https://dependencyci.com/github/alpjs/alp-params
[circleci-status-image]: https://img.shields.io/circleci/project/alpjs/alp-params/master.svg?style=flat-square
[circleci-status-url]: https://circleci.com/gh/alpjs/alp-params
[travisci-status-image]: https://img.shields.io/travis/alpjs/alp-params/master.svg?style=flat-square
[travisci-status-url]: https://travis-ci.org/alpjs/alp-params
[coverage-image]: https://img.shields.io/codecov/c/github/alpjs/alp-params/master.svg?style=flat-square
[coverage-url]: https://codecov.io/gh/alpjs/alp-params
[docs-coverage-url]: https://alpjs.github.io/alp-params/coverage/lcov-report/
