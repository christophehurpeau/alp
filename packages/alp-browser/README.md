# alp-browser [![NPM version][npm-image]][npm-url]

framework for browser based on ibex

[![Dependency ci Status][dependencyci-image]][dependencyci-url]
[![Dependency Status][daviddm-image]][daviddm-url]

## Install

```bash
npm install --save alp-browser
```

## Usage

```js
import Alp from 'alp-browser';

const app = new Alp();

app.start(async () => {
  // init
  await app.init();

  // middlewares
  app.catchErrors();

  if (window.MODULE_IDENTIFIER) {
    await app.initialRender(moduleDescriptors[window.MODULE_IDENTIFIER], window.initialData);
  }

  await app.run();
});

```

[npm-image]: https://img.shields.io/npm/v/alp-browser.svg?style=flat-square
[npm-url]: https://npmjs.org/package/alp-browser
[daviddm-image]: https://david-dm.org/alpjs/alp-browser.svg?style=flat-square
[daviddm-url]: https://david-dm.org/alpjs/alp-browser
[dependencyci-image]: https://dependencyci.com/github/alpjs/alp-browser/badge?style=flat-square
[dependencyci-url]: https://dependencyci.com/github/alpjs/alp-browser
