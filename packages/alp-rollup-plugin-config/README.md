<h1 align="center">
  alp-rollup-plugin-config
</h1>

<p align="center">
  transform yaml config using rollup copy plugin and yaml transform
</p>

<p align="center">
  <a href="https://npmjs.org/package/alp-rollup-plugin-config"><img src="https://img.shields.io/npm/v/alp-rollup-plugin-config.svg?style=flat-square" alt="npm version"></a>
  <a href="https://npmjs.org/package/alp-rollup-plugin-config"><img src="https://img.shields.io/npm/dw/alp-rollup-plugin-config.svg?style=flat-square" alt="npm downloads"></a>
  <a href="https://npmjs.org/package/alp-rollup-plugin-config"><img src="https://img.shields.io/node/v/alp-rollup-plugin-config.svg?style=flat-square" alt="node version"></a>
  <a href="https://npmjs.org/package/alp-rollup-plugin-config"><img src="https://img.shields.io/npm/types/alp-rollup-plugin-config.svg?style=flat-square" alt="types"></a>
</p>

## Install

```bash
npm install --save alp-rollup-plugin-config
```

## Usage

> rollup.config.js

```js
import config from "alp-rollup-plugin-config";

export default {
  plugins: [
    config({
      targets: [{ src: "config/*", dest: "dist/config" }],
    }),
  ],
};
```
