<h3 align="center">
  alp-body-parser
</h3>

<p align="center">
  body parser in alp framework
</p>

<p align="center">
  <a href="https://npmjs.org/package/alp-body-parser"><img src="https://img.shields.io/npm/v/alp-body-parser.svg?style=flat-square"></a>
  <a href="https://npmjs.org/package/alp-body-parser"><img src="https://img.shields.io/npm/dw/alp-body-parser.svg?style=flat-square"></a>
  <a href="https://npmjs.org/package/alp-body-parser"><img src="https://img.shields.io/node/v/alp-body-parser.svg?style=flat-square"></a>
  <a href="https://npmjs.org/package/alp-body-parser"><img src="https://img.shields.io/npm/types/alp-body-parser.svg?style=flat-square"></a>
</p>

## Install

```bash
npm install --save alp-body-parser
```

## Usage

```js
import Koa from "koa";
import { config } from "alp-node";
import bodyParser from "alp-body-parser";

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
