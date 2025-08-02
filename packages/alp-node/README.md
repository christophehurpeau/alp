<h1 align="center">
  alp-node
</h1>

<p align="center">
  framework based on koa 2
</p>

<p align="center">
  <a href="https://npmjs.org/package/alp-node"><img src="https://img.shields.io/npm/v/alp-node.svg?style=flat-square" alt="npm version"></a>
  <a href="https://npmjs.org/package/alp-node"><img src="https://img.shields.io/npm/dw/alp-node.svg?style=flat-square" alt="npm downloads"></a>
  <a href="https://npmjs.org/package/alp-node"><img src="https://img.shields.io/node/v/alp-node.svg?style=flat-square" alt="node version"></a>
  <a href="https://npmjs.org/package/alp-node"><img src="https://img.shields.io/npm/types/alp-node.svg?style=flat-square" alt="types"></a>
</p>

## Install

```bash
npm install --save alp-node
```

## Usage

```js
import Alp from "alp-node";

const app = new Alp();
app.servePublic();
app.catchErrors();
app.listen();
```
