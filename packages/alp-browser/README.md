<h3 align="center">
  alp-browser
</h3>

<p align="center">
  framework for browser based on ibex
</p>

<p align="center">
  <a href="https://npmjs.org/package/alp-browser"><img src="https://img.shields.io/npm/v/alp-browser.svg?style=flat-square"></a>
  <a href="https://david-dm.org/alpjs/alp-browser"><img src="https://david-dm.org/alpjs/alp-browser.svg?style=flat-square"></a>
  <a href="https://dependencyci.com/github/alpjs/alp-browser"><img src="https://dependencyci.com/github/alpjs/alp-browser/badge?style=flat-square"></a>
</p>

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
