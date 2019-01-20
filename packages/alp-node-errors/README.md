<h3 align="center">
  alp-node-errors
</h3>

<p align="center">
  display errors in alp framework
</p>

<p align="center">
  <a href="https://npmjs.org/package/alp-node-errors"><img src="https://img.shields.io/npm/v/alp-node-errors.svg?style=flat-square"></a>
  <a href="https://david-dm.org/christophehurpeau/alp?path=packages/alp-node-errors"><img src="https://david-dm.org/christophehurpeau/alp?path=packages/alp-node-errors.svg?style=flat-square"></a>
</p>

## Install

```bash
npm install --save alp-node-errors
```

## Usage

```js
import Koa from 'koa';
import config from 'alp-node-config';
import errors from 'alp-node-errors';

const app = new Koa();
config(__dirname + '/config')(app);
logger(app);

app.use(errors);
```
