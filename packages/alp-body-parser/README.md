# alp-body-parser [![NPM version][npm-image]][npm-url]

body parser in alp framework

[![Dependency Status][daviddm-image]][daviddm-url]
[![Dependency ci Status][dependencyci-image]][dependencyci-url]

## Install

```bash
npm install --save alp-body-parser
```

## Usage

```js
import Koa from 'koa';
import config from 'alp-config';
import bodyParser from 'alp-body-parser';

const app = new Koa();
config(`${__dirname}/config`, { packageConfig })(app);
bodyParser(app);
```

```js

export default {
    async form(ctx) {
        const body = await ctx.parseBody();
    },

    async json(ctx) {
        const body = await ctx.parseBodyJson();
    },

    async text(ctx) {
        const body = await ctx.parseBodyText();
    },
};
```

[npm-image]: https://img.shields.io/npm/v/alp-body-parser.svg?style=flat-square
[npm-url]: https://npmjs.org/package/alp-body-parser
[daviddm-image]: https://david-dm.org/alpjs/alp-body-parser.svg?style=flat-square
[daviddm-url]: https://david-dm.org/alpjs/alp-body-parser
[dependencyci-image]: https://dependencyci.com/github/alpjs/alp-body-parser/badge?style=flat-square
[dependencyci-url]: https://dependencyci.com/github/alpjs/alp-body-parser
