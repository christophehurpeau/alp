# alp-node [![NPM version][npm-image]][npm-url]

framework based on koa 2

[![Dependency Status][daviddm-image]][daviddm-url]
[![Dependency ci Status][dependencyci-image]][dependencyci-url]

## Install

```bash
npm install --save alp-node
```

## Usage

```js
import Alp from 'alp-node';

const app = new Alp();
app.servePublic();
app.catchErrors();
app.listen();
```

[npm-image]: https://img.shields.io/npm/v/alp-node.svg?style=flat-square
[npm-url]: https://npmjs.org/package/alp-node
[daviddm-image]: https://david-dm.org/alpjs/alp-node.svg?style=flat-square
[daviddm-url]: https://david-dm.org/alpjs/alp-node
[dependencyci-image]: https://dependencyci.com/github/alpjs/alp-node/badge?style=flat-square
[dependencyci-url]: https://dependencyci.com/github/alpjs/alp-node
