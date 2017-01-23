# alp-react-redux [![NPM version][npm-image]][npm-url]

render with react and redux in alp framework

[![Dependency ci Status][dependencyci-image]][dependencyci-url]
[![Dependency Status][daviddm-image]][daviddm-url]

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


## createAction / createReducer

[Reduce some boilerplate in your application](http://redux.js.org/docs/recipes/ReducingBoilerplate.html):

```js
import { createAction, createReducer } from 'alp-react-redux';


export const increment = createAction('INCREMENT');
export const addTodo = createAction('ADD_TODO'); // addTodo({ name: 'Todo Name' })
export const removeTodo = createAction('REMOVE_TODO', ['id']); // removeTodo(todo.id)

export default createReducer(() => [], {
    [addTodo]: (todos, todo) => [...todos, todo],
    [removeTodo]: (state, { id }) => todos.filter(todo => todo.id !== id),
});
```

[npm-image]: https://img.shields.io/npm/v/alp-react-redux.svg?style=flat-square
[npm-url]: https://npmjs.org/package/alp-react-redux
[daviddm-image]: https://david-dm.org/alpjs/alp-react-redux.svg?style=flat-square
[daviddm-url]: https://david-dm.org/alpjs/alp-react-redux
[dependencyci-image]: https://dependencyci.com/github/alpjs/alp-react-redux/badge?style=flat-square
[dependencyci-url]: https://dependencyci.com/github/alpjs/alp-react-redux
