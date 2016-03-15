# alp-react-redux


### With Koa

```js
import Koa from 'koa';
import reactredux from 'alp-react-redux';
import Html from './HtmlComponent';

const app = new Koa();
reactredux(__dirname + '/views')(Html)(app);

// ...

(ctx) => {
    ctx.render(MyComponent, data);
}
```

### With Ibex

```js
import Ibex from 'ibex';
import reactredux from 'alp-react-redux';
import moduleDescriptor from './reduxApp';

const const app = new Ibex();
reactredux({
    moduleDescriptor,
    initialData: window.__INITIAL_STATE__,
    element: document.getElementById('app'),
})(app);


// ...

(ctx) => {
    ctx.render(MyComponent, data);
}
```
