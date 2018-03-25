<h3 align="center">
  alp-react-redux
</h3>

<p align="center">
  render with react and redux in alp framework
</p>

<p align="center">
  <a href="https://npmjs.org/package/alp-react-redux"><img src="https://img.shields.io/npm/v/alp-react-redux.svg?style=flat-square"></a>
  <a href="https://david-dm.org/alpjs/alp-react-redux"><img src="https://david-dm.org/alpjs/alp-react-redux.svg?style=flat-square"></a>
  <a href="https://dependencyci.com/github/alpjs/alp-react-redux"><img src="https://dependencyci.com/github/alpjs/alp-react-redux/badge?style=flat-square"></a>
</p>

## How to install

```
npm install --save koa@2 alp-react-redux
```

## Examples

### With Koa

```js
import Koa from 'koa';
import reactredux from 'alp-react-redux';
import moduleDescriptor from './reduxApp';

const app = new Koa();
reactredux()(app);

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
})(app);


// ...

(ctx) => {
    ctx.render(moduleDescriptor, data);
}
```

## How it works

`alp-react-redux` render react components.

It add in Koa's context (or Ibex's context) the following method:
> render(moduleDescriptor, data)

`moduleDescriptor` is an object with two properties: `View` and optional `reducer`. If the reducer is not set, the view is rendered as a simple component.
`data` is an object with the initial data, sent to redux as the initial data for the store, or to react simple component as properties

For browser, this package keeps a single redux store, and reinitialize it each time the `render` method is called.


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
