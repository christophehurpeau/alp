# alp-react-redux

Render in react and redux with context and layout

## How to install

```
npm install --save koa@2 alp-react-redux
```

## Examples

### With Koa

```js
import Koa from 'koa';
import reactredux from 'alp-react-redux';
import Html from './HtmlComponent';
import moduleDescriptor from './reduxApp';

const app = new Koa();
reactredux(Html)(app);

// ...

(ctx) => {
    ctx.render(moduleDescriptor, data);
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

## How it works

`alp-react-redux` use [`fody`](https://www.npmjs.com/package/fody) to render react components.

It add in Koa's context (or Ibex's context) the following method:
> render(moduleDescriptor, data)

`moduleDescriptor` is an object with two properties: `View` and optional `reducer`. If the reducer is not set, the view is rendered as a simple component.
`data` is an object with the initial data, sent to redux as the initial data for the store, or to react simple component as properties

For brower, this package keeps a single redux store, and reinitialize it each time the `render` method is called.
