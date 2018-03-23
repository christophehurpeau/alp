<h3 align="center">
  alp-errors-node
</h3>

<p align="center">
  display errors in alp framework
</p>

<p align="center">
  <a href="https://npmjs.org/package/alp-errors-node"><img src="https://img.shields.io/npm/v/alp-errors-node.svg?style=flat-square"></a>
  <a href="https://david-dm.org/alpjs/alp-errors-node"><img src="https://david-dm.org/alpjs/alp-errors-node.svg?style=flat-square"></a>
  <a href="https://dependencyci.com/github/alpjs/alp-errors-node"><img src="https://dependencyci.com/github/alpjs/alp-errors-node/badge?style=flat-square"></a>
</p>

## Install

```bash
npm install --save alp-errors-node
```

## Usage

```js
import Koa from 'koa';
import config from 'alp-config';
import errors from 'alp-errors-node';

const app = new Koa();
config(__dirname + '/config')(app);
logger(app);

app.use(errors);
```
