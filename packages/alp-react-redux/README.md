# auk-react

```js
import Koa from 'koa';
import react from 'auk-react';
import Html from './HtmlComponent';

const app = new Koa();
react(__dirname + '/views')(Html)(app);

// ...

(ctx) => {
    ctx.render(MyComponent, data);
}
```
