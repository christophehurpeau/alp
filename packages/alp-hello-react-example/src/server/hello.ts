/// <reference types="webpack-env" />

// https://github.com/Microsoft/TypeScript/issues/15230
export const _ = '';

const interval = setInterval(() => {
  console.log('hello !');
}, 4000);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  import.meta.webpackHot.dispose(() => clearInterval(interval));
}
